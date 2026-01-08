import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Wallet,
  Key,
  Trash2,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function SettingsView() {
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    yieldUpdates: true,
    bridgeComplete: true,
    securityAlerts: true,
    newsletter: false,
    marketing: false,
  });

  const [preferences, setPreferences] = useState({
    currency: "usd",
    language: "en",
    theme: "light",
    timezone: "utc",
  });

  const walletAddress = "GDRXE2BQUC3AZNPVFSCEZ76NJ3WWAS...";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success("Wallet address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-4xl overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 md:space-y-6 w-full">
        <TabsList className="bg-muted/50 h-auto w-full grid grid-cols-4 p-1 gap-1">
          <TabsTrigger value="profile" className="gap-1 text-xs md:text-sm px-1.5 sm:px-2 py-2 flex items-center justify-center">
            <User className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 text-xs md:text-sm px-1.5 sm:px-2 py-2 flex items-center justify-center">
            <Bell className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 text-xs md:text-sm px-1.5 sm:px-2 py-2 flex items-center justify-center">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1 text-xs md:text-sm px-1.5 sm:px-2 py-2 flex items-center justify-center">
            <Palette className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="overflow-hidden border-border/50">
            <CardHeader className="px-3 py-4 sm:px-6 sm:py-5">
              <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="displayName" className="text-xs sm:text-sm">Display Name</Label>
                  <Input id="displayName" placeholder="Enter display name" defaultValue="Stellar User" className="h-9 sm:h-10 text-sm" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter email" defaultValue="user@example.com" className="h-9 sm:h-10 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bio" className="text-xs sm:text-sm">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" className="h-9 sm:h-10 text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/50">
            <CardHeader className="px-3 py-4 sm:px-6 sm:py-5">
              <CardTitle className="text-base sm:text-lg">Connected Wallet</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your connected Stellar wallet</CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-4 sm:px-6 sm:pb-6">
              <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-foreground">Stellar Wallet</p>
                    <p className="text-[10px] sm:text-xs font-mono text-muted-foreground truncate">{walletAddress}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" onClick={handleCopyAddress}>
                    {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pb-2 sm:pb-4">
            <Button onClick={handleSave} className="w-full sm:w-auto h-9 sm:h-10 text-sm">Save Changes</Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alert Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when asset prices change significantly
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, priceAlerts: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yield Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about APY changes in your positions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.yieldUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, yieldUpdates: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bridge Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when cross-chain transfers complete
                    </p>
                  </div>
                  <Switch
                    checked={notifications.bridgeComplete}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, bridgeComplete: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security notifications (recommended)
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, securityAlerts: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Preferences</CardTitle>
              <CardDescription>Manage email communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly updates about DeFi trends
                  </p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newsletter: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Product updates and promotional offers
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, marketing: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">2FA Not Enabled</p>
                    <p className="text-xs text-muted-foreground">
                      Protect your account with two-factor authentication
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Management</CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Current Session</p>
                  <p className="text-xs text-muted-foreground">Chrome on macOS • San Francisco, US</p>
                </div>
                <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                  Active
                </span>
              </div>
              <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Display Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="btc">BTC (₿)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="cet">Central European</SelectItem>
                      <SelectItem value="jst">Japan Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data & Privacy</CardTitle>
              <CardDescription>Manage how your data is used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve Yielder with anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your portfolio performance
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
