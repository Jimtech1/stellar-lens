import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, LogOut, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserSettings {
  currency: string;
  language: string;
  theme: string;
}

export function SettingsView() {
  const { address, isConnected, walletType } = useWallet();
  const { logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  // Dynamic Labels
  const isEVM = walletType === 'metamask';
  const walletLabel = isEVM ? 'EVM Wallet' : 'Stellar Wallet';
  const networkLabel = isEVM ? 'EVM' : 'Stellar';

  // Fetch Settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['user_settings'],
    queryFn: async () => {
      try {
        const res = await api.get<UserSettings>('/user/settings');
        return res || { currency: 'usd', language: 'en', theme: 'system' };
      } catch (e) {
        return { currency: 'usd', language: 'en', theme: 'system' };
      }
    },
    enabled: isConnected
  });

  const [localSettings, setLocalSettings] = useState<UserSettings>({
    currency: 'usd',
    language: 'en',
    theme: 'system'
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Update Settings
  const mutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      return await api.post('/user/settings', newSettings);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ['user_settings'] });
    },
    onError: () => {
      toast.error("Failed to save settings");
    }
  });

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Wallet address copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    mutation.mutate(localSettings);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Wallet Not Connected</h2>
        <p className="text-muted-foreground mb-4">Please connect your wallet to view settings.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>

      <div className="space-y-6">
        {/* Wallet Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connected Wallet</CardTitle>
            <CardDescription>Your active {networkLabel} account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{walletLabel}</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{address}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Customize your application experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={localSettings.currency}
                  onValueChange={(val) => setLocalSettings({ ...localSettings, currency: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="btc">BTC (₿)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={localSettings.language}
                  onValueChange={(val) => setLocalSettings({ ...localSettings, language: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={localSettings.theme}
                  onValueChange={(val) => setLocalSettings({ ...localSettings, theme: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
