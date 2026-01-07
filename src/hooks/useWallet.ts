import { useState, useCallback, useEffect } from 'react';
import { WalletType, connectWallet, formatAddress } from '@/lib/wallets';

interface WalletState {
  address: string | null;
  walletType: WalletType | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

const WALLET_STORAGE_KEY = 'yielder_wallet';

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    walletType: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  // Restore wallet connection from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      try {
        const { address, walletType } = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          address,
          walletType,
          isConnected: true,
        }));
      } catch (e) {
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    }
  }, []);

  const connect = useCallback(async (walletType: WalletType) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const address = await connectWallet(walletType);
      
      if (address) {
        const newState = {
          address,
          walletType,
          isConnecting: false,
          isConnected: true,
          error: null,
        };
        setState(newState);
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({ address, walletType }));
        return address;
      } else {
        setState(prev => ({ ...prev, isConnecting: false }));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      walletType: null,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);

  const formattedAddress = state.address ? formatAddress(state.address) : null;

  return {
    ...state,
    formattedAddress,
    connect,
    disconnect,
  };
}
