import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useWallet } from './WalletContext';
import { WalletType } from '../lib/wallets';

interface User {
    id: string;
    email?: string;
    wallets: Array<{
        publicKey: string;
        chain: string;
    }>;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    loginWithWallet: (type: WalletType) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { connect, signMessage, disconnect } = useWallet();

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await api.get<User>('/auth/me');
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // Token might be invalid, but let api.ts handle refresh logic
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const response = await api.post<any>('/auth/login', { email, password: pass });
            handleAuthSuccess(response);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, pass: string) => {
        try {
            const response = await api.post<any>('/auth/register', { email, password: pass });
            handleAuthSuccess(response);
        } catch (error) {
            throw error;
        }
    };

    const loginWithWallet = async (type: WalletType) => {
        try {
            console.log("------------------------------------------");
            console.log(`[Auth] Starting wallet login with ${type}`);

            // 1. Connect Wallet
            const publicKey = await connect(type);
            console.log(`[Auth] Wallet connected, publicKey:`, publicKey);

            if (!publicKey) throw new Error('Failed to connect wallet');

            try {
                // 2. Get Challenge
                console.log(`[Auth] Requesting challenge for ${publicKey}...`);
                const challengeRes = await api.get<{ challenge: string; expire: number }>(`/auth/wallet/challenge?publicKey=${publicKey}`)
                    .catch((err) => {
                        console.error("[Auth] Challenge request failed:", err);
                        return null;
                    });

                console.log(`[Auth] Challenge response:`, challengeRes);

                if (challengeRes) {
                    // 3. Sign Challenge
                    console.log(`[Auth] Signing challenge: "${challengeRes.challenge.substring(0, 20)}..."`);
                    const signature = await signMessage(challengeRes.challenge);
                    console.log(`[Auth] Signature generated:`, signature ? "Yes (length " + signature.length + ")" : "No");

                    // 4. Verify & Login
                    console.log(`[Auth] Sending login request...`);
                    const loginRes = await api.post<any>('/auth/wallet/login', {
                        publicKey,
                        signature
                    });
                    console.log(`[Auth] Login response received:`, loginRes);

                    handleAuthSuccess(loginRes);
                    console.log(`[Auth] handleAuthSuccess completed.`);
                } else {
                    console.warn('[Auth] No challenge returned, falling back to local mode');
                    // ... fallback code
                    const mockUser: User = {
                        id: 'local-' + publicKey.slice(0, 8),
                        wallets: [{ publicKey, chain: type === 'metamask' ? 'evm' : 'stellar' }]
                    };
                    setUser(mockUser);
                    localStorage.setItem('access_token', 'mock_token_' + publicKey);
                }
            } catch (apiError: any) {
                console.error("[Auth] API Error during login flow:", apiError);
                if (!apiError.response || apiError.response.status >= 500) {
                    console.log("[Auth] Network/Server error, using fallback");
                    const mockUser: User = {
                        id: 'local-' + publicKey.slice(0, 8),
                        wallets: [{ publicKey, chain: type === 'metamask' ? 'evm' : 'stellar' }]
                    };
                    setUser(mockUser);
                    localStorage.setItem('access_token', 'mock_token_' + publicKey);
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error('[Auth] Wallet login failed:', error);
            disconnect();
            throw error;
        }
    };

    const handleAuthSuccess = (response: any) => {
        const { accessToken, refreshToken, user } = response;
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        setUser(user);
        // api.ts interceptor will pick up the new token automatically
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        disconnect();
        // Redirect logic usually handled by router or calling component
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            loginWithWallet,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
