import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Droplets, Loader2 } from "lucide-react";
import { EarnDialog } from "./forms/EarnDialog";
import { toast } from "sonner";

export function DeFiView() {
    const [activeTab, setActiveTab] = useState("explore");
    const [selectedOpp, setSelectedOpp] = useState<any>(null);
    const [earnOpen, setEarnOpen] = useState(false);

    // Fetch Yield Opportunities
    const { data: yields, isLoading } = useQuery({
        queryKey: ['yields'],
        queryFn: async () => {
            const res = await api.get<any[]>('/defi/yields');
            return res || [];
        }
    });

    // Fetch Active Positions
    const { data: positions } = useQuery({
        queryKey: ['defi_positions'],
        queryFn: async () => {
            const res = await api.get<any>('/portfolio/positions');
            return res?.positions || [];
        }
    });

    const handleInvestClick = (opp: any) => {
        setSelectedOpp(opp);
        setEarnOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-h2 font-semibold text-foreground">DeFi</h1>
                    <p className="text-muted-foreground">Manage positions and discover yields</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="explore">Explore Yields</TabsTrigger>
                    <TabsTrigger value="positions">My Positions</TabsTrigger>
                </TabsList>

                <TabsContent value="positions" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Positions List */}
                            {(!positions || positions.length === 0) ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No active DeFi positions found. Start by exploring yields.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {positions.map((pos: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                                            <div>
                                                <p className="font-semibold">{pos.protocol} - {pos.asset}</p>
                                                <p className="text-sm text-muted-foreground">{pos.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono">{pos.balance} {pos.asset}</p>
                                                <Badge variant="outline" className="text-success">Active</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="explore" className="mt-4 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {yields?.map((opp: any) => (
                                <Card key={opp.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleInvestClick(opp)}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Droplets className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-semibold truncate max-w-[120px]" title={opp.name}>{opp.name || opp.protocol}</span>
                                        </div>
                                        <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                                            {opp.apy}% APY
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Protocol</p>
                                                <p className="text-sm font-medium">{opp.protocol}</p>
                                            </div>
                                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleInvestClick(opp); }}>
                                                Invest
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!yields || yields.length === 0) && (
                                <div className="col-span-full text-center py-8 text-muted-foreground">
                                    No yield opportunities available at the moment.
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Earn Dialog */}
            {selectedOpp && (
                <EarnDialog
                    open={earnOpen}
                    onOpenChange={setEarnOpen}
                />
            )}
        </div>
    );
}
