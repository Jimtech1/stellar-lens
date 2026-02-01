import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectFreighter, connectMetaMask, WalletType, formatAddress } from '../lib/wallets';
import { ethers } from 'ethers';

interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    formattedAddress: string | null;
    chain: 'stellar' | 'evm' | null;
    walletType: WalletType | null;
}

interface WalletContextType extends WalletState {
    connect: (type: WalletType) => Promise<string | null>;
    disconnect: () => void;
    signMessage: (message: string) => Promise<string>;
    signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
        address: null,
        formattedAddress: null,
        chain: null,
        walletType: null,
    });

    // Refs to allow functions to access latest state immediately without waiting for re-renders
    const stateRef = React.useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Restore wallet connection on load
    useEffect(() => {
        const savedWallet = localStorage.getItem('connected_wallet') as WalletType;
        if (savedWallet) {
            // Optional: Auto-connect logic or verify if still connected
            // For now, we leave it as manual connect to avoid issues, 
            // or we could try to eager connect if the library supports it.
        }
    }, []);

    const connect = async (type: WalletType): Promise<string | null> => {
        setState(prev => ({ ...prev, isConnecting: true }));
        try {
            let address: string | null = null;
            let chain: 'stellar' | 'evm' | null = null;

            if (type === 'freighter') {
                address = await connectFreighter();
                chain = 'stellar';
            } else if (type === 'metamask') {
                address = await connectMetaMask();
                chain = 'evm';
            } else {
                console.warn('Wallet type not fully implemented in context:', type);
            }

            if (address) {
                const newState = {
                    isConnected: true,
                    isConnecting: false,
                    address,
                    formattedAddress: formatAddress(address),
                    chain,
                    walletType: type,
                };
                setState(newState);
                stateRef.current = newState; // Update ref immediately
                localStorage.setItem('connected_wallet', type);
            } else {
                setState(prev => ({ ...prev, isConnecting: false }));
            }
            return address;
        } catch (error) {
            setState(prev => ({ ...prev, isConnecting: false }));
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    };

    const disconnect = () => {
        const newState = {
            isConnected: false,
            isConnecting: false,
            address: null,
            formattedAddress: null,
            chain: null,
            walletType: null,
        };
        setState(newState);
        stateRef.current = newState;
        localStorage.removeItem('connected_wallet');
    };

    const signMessage = async (message: string): Promise<string> => {
        // Use ref to get the absolute latest state (handling the connect->sign race condition)
        const currentState = stateRef.current;

        if (!currentState.address || !currentState.walletType) throw new Error('No wallet connected');

        if (currentState.walletType === 'freighter') {
            try {
                // Dynamic import to avoid SSR issues if any, but standard import is fine usually
                const { signMessage: signFreighterMessage } = await import("@stellar/freighter-api");
                const response = await signFreighterMessage(message);

                if (response.error) {
                    throw new Error(response.error);
                }
                // Freighter returns the signed message (signature) directly in some versions or an object
                // Based on docs: returns { signedMessage } or error
                return response.signedMessage as string;
            } catch (e) {
                console.error("Freighter signing error", e);
                throw new Error("Failed to sign message with Freighter");
            }
        }

        if (currentState.walletType === 'metamask') {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            return await signer.signMessage(message);
        }

        throw new Error('Signing not implemented for this wallet');
    };

    const signTransaction = async (xdr: string): Promise<string> => {
        const currentState = stateRef.current;
        if (!currentState.address || !currentState.walletType) throw new Error('No wallet connected');

        if (currentState.walletType === 'freighter') {
            try {
                const { signTransaction: signFreighterTransaction } = await import("@stellar/freighter-api");
                const response = await signFreighterTransaction(xdr, { networkPassphrase: "Test SDF Network ; September 2015" }); // Using Testnet for dev, ideally configurable

                if (response.error) {
                    throw new Error(response.error);
                }
                return response.signedTxXdr;
            } catch (e) {
                console.error("Freighter tx signing error", e);
                throw new Error("Failed to sign transaction with Freighter");
            }
        }

        throw new Error("Transaction signing not supported for this wallet type");
    };

    return (
        <WalletContext.Provider value={{ ...state, connect, disconnect, signMessage, signTransaction }}>
            {children}
        </WalletContext.Provider>
    );
};
