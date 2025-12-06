import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Send, ArrowDownLeft, Coins, TrendingUp, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

interface AssetActionsMenuProps {
  asset: {
    id: string;
    symbol: string;
    name: string;
    chain: string;
  };
  onSend?: () => void;
  onReceive?: () => void;
  onStake?: () => void;
  onViewDetails?: () => void;
}

export function AssetActionsMenu({ asset, onSend, onReceive, onStake, onViewDetails }: AssetActionsMenuProps) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${asset.symbol.toLowerCase()}_address_placeholder`);
    toast.success(`${asset.symbol} address copied`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card">
        <DropdownMenuItem onClick={onSend} className="gap-2 cursor-pointer">
          <Send className="w-4 h-4" />
          Send {asset.symbol}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReceive} className="gap-2 cursor-pointer">
          <ArrowDownLeft className="w-4 h-4" />
          Receive {asset.symbol}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onStake} className="gap-2 cursor-pointer">
          <Coins className="w-4 h-4" />
          Stake
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewDetails} className="gap-2 cursor-pointer">
          <TrendingUp className="w-4 h-4" />
          View Charts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
          <Copy className="w-4 h-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
