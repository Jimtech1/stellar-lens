import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, Plus, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type ConnectedWallet = {
    publicKey: string;
    chain: string;
    label?: string;
    isWatchOnly?: boolean;
};

export function WalletManagementView() {
    const { user } = useAuth();
    const { connect } = useWallet();
    const [watchAddress, setWatchAddress] = useState("");
    const [isAddingWatch, setIsAddingWatch] = useState(false);

    // Fetch wallets linked to user
    const { data: wallets, refetch } = useQuery({
        queryKey: ['wallets'],
        queryFn: async () => {
            // If user is logged in, their wallets might be in user object or separate endpoint
            // For now assume /wallet/list or fallback to user.wallets
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
        </div>
    );
}
