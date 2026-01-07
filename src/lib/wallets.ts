// Wallet types and configurations
export type WalletType = 'freighter' | 'albedo' | 'metamask' | 'walletconnect';

export interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  description: string;
  chain: 'stellar' | 'evm';
}

export const WALLETS: WalletInfo[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    icon: '🚀',
    description: 'Stellar wallet browser extension',
    chain: 'stellar',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    icon: '🌟',
    description: 'Web-based Stellar wallet',
    chain: 'stellar',
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Popular EVM wallet extension',
    chain: 'evm',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect mobile wallets via QR',
    chain: 'evm',
  },
];

// Freighter wallet integration
export async function connectFreighter(): Promise<string | null> {
  try {
    // Check if Freighter is installed
    if (typeof window !== 'undefined' && (window as any).freighterApi) {
      const freighter = (window as any).freighterApi;
      const isConnected = await freighter.isConnected();
      
      if (!isConnected) {
        throw new Error('Freighter is not connected');
      }
      
      const publicKey = await freighter.getPublicKey();
      return publicKey;
    }
    
    // Freighter not installed
    window.open('https://www.freighter.app/', '_blank');
    return null;
  } catch (error) {
    console.error('Freighter connection error:', error);
    throw error;
  }
}

// Albedo wallet integration
export async function connectAlbedo(): Promise<string | null> {
  try {
    // Dynamic import for Albedo
    const albedo = await import('@albedo-link/intent');
    const result = await albedo.default.publicKey({});
    return result.pubkey;
  } catch (error) {
    console.error('Albedo connection error:', error);
    throw error;
  }
}

// MetaMask wallet integration
export async function connectMetaMask(): Promise<string | null> {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        return accounts[0];
      }
      return null;
    }
    
    // MetaMask not installed
    window.open('https://metamask.io/download/', '_blank');
    return null;
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
}

// WalletConnect integration (simplified - would need @walletconnect/web3-provider in production)
export async function connectWalletConnect(): Promise<string | null> {
  try {
    // In production, you would use @walletconnect/web3-provider
    // For now, we'll show a message that it's being set up
    console.log('WalletConnect integration - requires additional setup');
    throw new Error('WalletConnect requires additional configuration. Coming soon!');
  } catch (error) {
    console.error('WalletConnect connection error:', error);
    throw error;
  }
}

// Main connect function
export async function connectWallet(walletType: WalletType): Promise<string | null> {
  switch (walletType) {
    case 'freighter':
      return connectFreighter();
    case 'albedo':
      return connectAlbedo();
    case 'metamask':
      return connectMetaMask();
    case 'walletconnect':
      return connectWalletConnect();
    default:
      throw new Error(`Unknown wallet type: ${walletType}`);
  }
}

// Format address for display
export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
