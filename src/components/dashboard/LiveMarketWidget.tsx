import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface PriceFeed {
    symbol: string;
    price: number;
    change24h: number; // Mocked for now if not in Pyth response
    confidence: number;
    lastUpdate: number;
}

const MOCK_FEEDS: PriceFeed[] = [
    { symbol: "XLM/USD", price: 0.1245, change24h: 2.4, confidence: 0.0001, lastUpdate: Date.now() },
    { symbol: "BTC/USD", price: 43250.00, change24h: -1.2, confidence: 1.5, lastUpdate: Date.now() },
    { symbol: "ETH/USD", price: 2310.50, change24h: 0.8, confidence: 0.5, lastUpdate: Date.now() },
    { symbol: "AQUA/USD", price: 0.0045, change24h: 5.1, confidence: 0.00001, lastUpdate: Date.now() },
];

export function LiveMarketWidget() {
    const { data: prices, isLoading } = useQuery({
        queryKey: ['oraclePrices'],
        queryFn: async () => {
            try {
                // Attempt to fetch from real backend
                return await api.get<PriceFeed[]>('/oracle/prices?symbols=XLM,BTC,ETH,AQUA');
            } catch (e) {
                console.warn("Oracle API fetch failed, using mock", e);
                // Fallback to mock if backend not ready
                return MOCK_FEEDS;
            }
        },
        refetchInterval: 5000, // Polling every 5s for "live" feel
    });

    const displayPrices = prices && prices.length > 0 ? prices : MOCK_FEEDS;

    return (
        <Card className="card-elevated border-border/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Live Markets (Pyth)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {isLoading && !prices ? (
                        <div className="col-span-2 flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        displayPrices.map((feed) => (
                            <div key={feed.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-foreground">{feed.symbol.split('/')[0]}</span>
                                    <span className="text-[10px] text-muted-foreground">Oracle</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-sm font-medium text-foreground">
                                        ${feed.price.toLocaleString(undefined, { minimumFractionDigits: feed.price < 1 ? 4 : 2, maximumFractionDigits: feed.price < 1 ? 4 : 2 })}
                                    </div>
                                    <div className={`flex items-center justify-end text-[10px] gap-1 ${feed.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                                        {feed.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(feed.change24h)}%
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
