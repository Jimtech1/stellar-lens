import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';


// Configuration
// Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.helix.io/v1';

// Types
export interface ApiResponse<T = any> {
  data: T;
  meta?: any;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Memory Cache Store
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds default cache

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[] = [];

  constructor() {
    // 1. Create Axios instance with Rate Limiting
    // Rate limits from requirements:
    // Auth: 5-10/min, Portfolio: 60/min, Wallet: 30/min, Tx: 10/min
    // We pick a safe conservative limit for general usage, e.g., 2 requests per second globally
    // for the client side to avoid hitting server limits too hard.
    // 1. Create Axios instance (Removed Rate Limiter for debugging/simplicity)
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 1. Inject Auth Token
        const token = localStorage.getItem('access_token');
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        
        if (token && config.headers) {
          // Skip attachment if it's a mock token to avoid 401s from real APIs if they exist partially
          if (!token.startsWith('mock_token_')) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log(`[API Request] Attached Token: Bearer ${token.substring(0, 10)}...`);
          } else {
              console.log(`[API Request] Mock token detected, skipping Authorization header.`);
          }
        } else {
            console.warn(`[API Request] No token found in localStorage or headers object missing.`);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: any) => {
        const originalRequest = error.config;

        // 1. Handle 401 Unauthorized (Token Refresh)
        // Skip for Login/Register endpoints - a 401 here means bad credentials, not expired token
        if (error.response?.status === 401 && !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/') && 
            !originalRequest.url?.includes('/login')) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // Call refresh endpoint directly (bypass interceptor)
            // Note: We use a fresh axios instance to avoid loops
            const response = await axios.post(`${BASE_URL}auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
            
            localStorage.setItem('access_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }

            this.processQueue(null, accessToken);
            this.isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.isRefreshing = false;
            // Logout user if refresh fails
            console.error('[API] Refresh failed or not possible, logging out.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        if (error.response?.status === 401) {
            console.error(`[API] 401 Error on ${originalRequest.url}. Redirecting to login (DISABLED FOR DEBUGGING).`);
            // window.location.href = '/login'; 
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Generic request wrappers with type safety
  public async get<T>(url: string, config?: AxiosRequestConfig & { cache?: boolean; ttl?: number }): Promise<T> {
    // Caching Logic
    const useCache = config?.cache ?? false; // Default off unless specified
    if (useCache) {
      const cacheKey = `${url}:${JSON.stringify(config?.params)}`;
      const cached = cache.get(cacheKey);
      const ttl = config?.ttl || CACHE_TTL;
      
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data as T;
      }
    }

    const response = await this.client.get<ApiResponse<T>>(url, config);
    const data = response.data.data !== undefined ? response.data.data : response.data;

    if (useCache) {
      const cacheKey = `${url}:${JSON.stringify(config?.params)}`;
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data as T;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    console.log(`[API] RAW Response for ${url}:`, response.data);
    
    // Explicitly handle "data.data" vs "data" unwrapping
    // If the server returns { data: ... }, we want the inside. 
    // If the server returns valid JSON that lacks a 'data' property but HAS the payload directly, we take that.
    
    const hasDataProperty = response.data && typeof response.data === 'object' && 'data' in response.data;
    
    const result = hasDataProperty ? response.data.data : response.data;
    console.log(`[API] Derived Result for ${url}:`, result);
    return result as T;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return (response.data.data !== undefined ? response.data.data : response.data) as T;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return (response.data.data !== undefined ? response.data.data : response.data) as T;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return (response.data.data !== undefined ? response.data.data : response.data) as T;
  }
}

export const api = new ApiClient();
