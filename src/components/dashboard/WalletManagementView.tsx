import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, Plus, Trash2, Eye, Star, Send, ArrowRightLeft, Copy, ExternalLink, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DepositWithdrawDialog } from "./forms/DepositWithdrawDialog";
import { SwapDialog } from "./forms/SwapDialog";
import { EarnDialog } from "./forms/EarnDialog";

type ConnectedWallet = {
    publicKey: string;
    chain: string;
    label?: string;
    isWatchOnly?: boolean;
};

export function WalletManagementView() {
    const { user } = useAuth();
    const { connect, isConnected, address, walletType } = useWallet();
    const [watchAddress, setWatchAddress] = useState("");
    const [isAddingWatch, setIsAddingWatch] = useState(false);
    const [copied, setCopied] = useState(false);

    // Dialog States
    const [depositOpen, setDepositOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [swapOpen, setSwapOpen] = useState(false);
    const [earnOpen, setEarnOpen] = useState(false);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success("Address copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Fetch active wallet data
    const { data: assets } = useQuery({
        queryKey: ['wallet_assets', address],
        queryFn: async () => {
            const res = await api.get<any[]>('/portfolio/assets');
            return res || [];
        },
        enabled: isConnected && !!address
    });

    const { data: transactions } = useQuery({
        queryKey: ['wallet_txs', address],
        queryFn: async () => {
            const res = await api.get<any[]>('/transactions?limit=1');
            return res || [];
        },
        enabled: isConnected && !!address
    });

    // Dynamic Asset Logic
    const isEVM = walletType === 'metamask';
    const nativeSymbol = isEVM ? 'ETH' : 'XLM';

    // Find native asset or fallback to first available
    const nativeAsset = assets?.find(a => a.symbol === nativeSymbol) || assets?.[0] || { balance: 0, value: 0 };
    const displayBalance = nativeAsset.balance || 0;
    const displayValue = nativeAsset.value || 0;
    const currentSymbol = nativeAsset.symbol || nativeSymbol;

    // Fetch wallets linked to user
    const { data: wallets, refetch } = useQuery({
        queryKey: ['wallets'],
        queryFn: async () => {
            try {
                return await api.get<ConnectedWallet[]>('/wallet/list');
            } catch {
                return (user?.wallets || []).map((w: any) => ({
                    ...w,
                    isWatchOnly: false
                })) as ConnectedWallet[];
            }
        },
        enabled: !!user
    });

    const handleConnectNew = async (type: 'freighter' | 'metamask') => {
        try {
            await connect(type);
            // Optionally link to account
            await api.post('/wallet/link', { type });
            refetch();
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddWatch = async () => {
        if (!watchAddress) return;
        setIsAddingWatch(true);
        try {
            await api.post('/wallet/watch', { address: watchAddress });
            setWatchAddress("");
            refetch();
        } catch (e) {
            console.error(e);
        } finally {
            setIsAddingWatch(false);
        }
    };

    const handleRemove = async (publicKey: string) => {
        try {
            await api.delete(`/wallet/${publicKey}`);
            refetch();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-h2 font-semibold text-foreground">Wallet Management</h1>
                    <p className="text-muted-foreground">Manage your connected and watched wallets</p>
                </div>
            </div>

            {isConnected && address && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                        {/* Balance Card */}
                        <Card className="bg-card/50 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted-foreground">{currentSymbol} Balance</span>
                                    <Star className="w-4 h-4 text-warning" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-mono text-primary">${displayValue.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground">≈ {displayBalance.toFixed(4)} {currentSymbol}</div>
                            </CardContent>
                        </Card>

                        {/* Status Card */}
                        <Card className="bg-card/50">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted-foreground">Account Status</span>
                                    <Wallet className="w-4 h-4 text-success" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-success">Active</div>
                                <div className="text-sm text-muted-foreground">Connected to {isEVM ? 'EVM' : 'Testnet'}</div>
                            </CardContent>
                        </Card>

                        {/* Transactions Card */}
                        <Card className="bg-card/50">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted-foreground">Recent Transactions</span>
                                    <Send className="w-4 h-4 text-warning" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {transactions && transactions.length > 0 ? (
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">{transactions[0].type}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(transactions[0].createdAt).toLocaleDateString()}</div>
                                    </div>
                                ) : (
                                    <div className="text-xl font-bold">-</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Network Card */}
                        <Card className="bg-card/50">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted-foreground">Network</span>
                                    <ArrowRightLeft className="w-4 h-4 text-warning" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isEVM ? 'Sepolia' : 'Testnet'}</div>
                                <div className="text-sm text-success flex items-center gap-1">
                                    ↑ Online
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Info Bar */}
                        <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-muted/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Star className="w-4 h-4" /> Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Public Key</div>
                                        <div className="font-mono text-sm break-all">{address}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
                                            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(isEVM ? `https://etherscan.io/address/${address}` : `https://stellar.expert/explorer/testnet/account/${address}`, '_blank')}>
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Network</div>
                                    <div className="inline-block px-2 py-1 rounded bg-secondary text-xs font-mono">{isEVM ? 'EVM TESTNET' : 'STELLAR TESTNET'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Button className="h-12 text-base shadow-sm" onClick={() => setDepositOpen(true)}>
                            <ArrowRightLeft className="w-5 h-5 rotate-90 mr-2" /> Deposit
                        </Button>
                        <Button className="h-12 text-base shadow-sm" variant="secondary" onClick={() => setWithdrawOpen(true)}>
                            <ArrowRightLeft className="w-5 h-5 -rotate-90 mr-2" /> Withdraw
                        </Button>
                        <Button className="h-12 text-base shadow-sm" variant="outline" onClick={() => setSwapOpen(true)}>
                            <ArrowRightLeft className="w-5 h-5 mr-2" /> Swap
                        </Button>
                        <Button className="h-12 text-base shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-none" onClick={() => setEarnOpen(true)}>
                            <Star className="w-5 h-5 mr-2" /> Earn
                        </Button>
                    </div>
                </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Connected Wallets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            Connected Wallets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleConnectNew('freighter')}>
                                + Connect Freighter
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleConnectNew('metamask')}>
                                + Connect MetaMask
                            </Button>
                        </div>
                        <div className="space-y-3 mt-4">
                            {wallets?.filter(w => !w.isWatchOnly).map((wallet, sum) => (
                                <div key={sum} className="flex justify-between items-center p-3 border rounded-lg bg-card/50">
                                    <div>
                                        <div className="font-mono text-sm">{wallet.publicKey}</div>
                                        <div className="text-xs text-muted-foreground uppercase">{wallet.chain}</div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => handleRemove(wallet.publicKey)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {(!wallets || wallets.length === 0) && <p className="text-sm text-muted-foreground">No wallets connected</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Watch Wallets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-warning" />
                            Watch List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter public address..."
                                value={watchAddress}
                                onChange={e => setWatchAddress(e.target.value)}
                            />
                            <Button onClick={handleAddWatch} disabled={!watchAddress || isAddingWatch}>
                                {isAddingWatch ? 'Adding...' : 'Watch'}
                            </Button>
                        </div>
                        <div className="space-y-3 mt-4">
                            {wallets?.filter(w => w.isWatchOnly).map((wallet, sum) => (
                                <div key={sum} className="flex justify-between items-center p-3 border rounded-lg bg-card/50">
                                    <div>
                                        <div className="font-mono text-sm">{wallet.publicKey}</div>
                                        <div className="text-xs text-muted-foreground uppercase">{wallet.chain}</div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => handleRemove(wallet.publicKey)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {(!wallets || wallets.filter(w => w.isWatchOnly).length === 0) && <p className="text-sm text-muted-foreground">No watched wallets</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <DepositWithdrawDialog open={depositOpen} onOpenChange={setDepositOpen} type="deposit" />
            <DepositWithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} type="withdraw" />
            <SwapDialog open={swapOpen} onOpenChange={setSwapOpen} />
            <EarnDialog open={earnOpen} onOpenChange={setEarnOpen} />
        </div>
    );
}
