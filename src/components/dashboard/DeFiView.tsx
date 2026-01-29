import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mockAssets } from "@/lib/mockData";
import { Droplets, TrendingUp } from "lucide-react";

export function DeFiView() {
    const [activeTab, setActiveTab] = useState("positions");

    // Fetch DeFi data
    const { data: defiData, isLoading } = useQuery({
        queryKey: ['defi'],
        queryFn: async () => {
            try {
                return await api.get<any>('/defi/positions');
            } catch {
                return { positions: [], opportunities: [] };
            }
        }
    });

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
                    <TabsTrigger value="positions">My Positions</TabsTrigger>
                    <TabsTrigger value="explore">Explore Yields</TabsTrigger>
                </TabsList>

                <TabsContent value="positions" className="mt-4 space-y-4">
                    {/* Positions Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder list */}
                            <div className="text-center py-8 text-muted-foreground">
                                No active DeFi positions found. Start by exploring yields.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="explore" className="mt-4 space-y-4">
                    {/* Explore Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Mock Opportunity Cards */}
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Droplets className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-semibold">USDC/XLM Pool</span>
                                    </div>
                                    <Badge variant="outline" className="text-success border-success/20 bg-success/10">High Yield</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-muted-foreground">APY</p>
                                            <p className="text-xl font-bold text-success">12.5%</p>
                                        </div>
                                        <Button size="sm">Invest</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
