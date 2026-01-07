import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WALLETS, WalletType, WalletInfo } from '@/lib/wallets';
import { toast } from 'sonner';
import { Loader2, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (walletType: WalletType) => Promise<string | null>;
  isConnecting: boolean;
}

export function WalletConnectDialog({
  open,
  onOpenChange,
  onConnect,
  isConnecting,
}: WalletConnectDialogProps) {
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(null);

  const handleConnect = async (wallet: WalletInfo) => {
    setConnectingWallet(wallet.id);
    
    try {
      const address = await onConnect(wallet.id);
      
      if (address) {
        setConnectedWallet(wallet.id);
        toast.success(`Connected to ${wallet.name}`, {
          description: `Address: ${address.slice(0, 8)}...${address.slice(-6)}`,
        });
        
        // Close dialog after short delay
        setTimeout(() => {
          onOpenChange(false);
          setConnectedWallet(null);
        }, 1000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection failed';
      toast.error(`Failed to connect ${wallet.name}`, {
        description: message,
      });
    } finally {
      setConnectingWallet(null);
    }
  };

  const stellarWallets = WALLETS.filter(w => w.chain === 'stellar');
  const evmWallets = WALLETS.filter(w => w.chain === 'evm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Yielder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stellar Wallets */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Stellar Network
            </h3>
            <div className="space-y-2">
              {stellarWallets.map((wallet) => (
                <WalletButton
                  key={wallet.id}
                  wallet={wallet}
                  isConnecting={connectingWallet === wallet.id}
                  isConnected={connectedWallet === wallet.id}
                  disabled={isConnecting}
                  onClick={() => handleConnect(wallet)}
                />
              ))}
            </div>
          </div>

          {/* EVM Wallets */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              EVM Networks
            </h3>
            <div className="space-y-2">
              {evmWallets.map((wallet) => (
                <WalletButton
                  key={wallet.id}
                  wallet={wallet}
                  isConnecting={connectingWallet === wallet.id}
                  isConnected={connectedWallet === wallet.id}
                  disabled={isConnecting}
                  onClick={() => handleConnect(wallet)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          By connecting, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface WalletButtonProps {
  wallet: WalletInfo;
  isConnecting: boolean;
  isConnected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function WalletButton({ wallet, isConnecting, isConnected, disabled, onClick }: WalletButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-between h-14 px-4 transition-all",
        isConnected && "border-success bg-success/10",
        !disabled && !isConnecting && "hover:border-primary hover:bg-primary/5"
      )}
      disabled={disabled || isConnecting}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{wallet.icon}</span>
        <div className="text-left">
          <div className="font-medium">{wallet.name}</div>
          <div className="text-xs text-muted-foreground">{wallet.description}</div>
        </div>
      </div>
      
      {isConnecting ? (
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      ) : isConnected ? (
        <Check className="w-5 h-5 text-success" />
      ) : (
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      )}
    </Button>
  );
}
