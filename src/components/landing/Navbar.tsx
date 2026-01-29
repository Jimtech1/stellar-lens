import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HoloLogo } from "@/components/HoloLogo";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const { disconnect, isConnected, formattedAddress } = useWallet();
  const { loginWithWallet, isLoading } = useAuth();

  // Local loading state for the dialog interactions
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const handleWalletConnect = async (type: any): Promise<string | null> => {
    try {
      setIsConnectingWallet(true);
      await loginWithWallet(type);
      setWalletDialogOpen(false);
      return "connected";
    } catch (e) {
      console.error("Login failed", e);
      throw e;
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#docs" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <nav className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <HoloLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-small font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={disconnect}
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="font-mono">{formattedAddress}</span>
              </Button>
            ) : (
              <Button
                variant="hero"
                size="sm"
                onClick={() => setWalletDialogOpen(true)}
                disabled={isConnectingWallet || isLoading}
              >
                {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-foreground rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-b border-border"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-lg hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {isConnected ? (
                  <Button
                    variant="outline"
                    className="w-full mt-2 flex items-center justify-center gap-2"
                    onClick={() => {
                      disconnect();
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="font-mono">{formattedAddress}</span>
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    className="w-full mt-2"
                    onClick={() => {
                      setWalletDialogOpen(true);
                      setIsMenuOpen(false);
                    }}
                    disabled={isConnectingWallet || isLoading}
                  >
                    {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <WalletConnectDialog
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        onConnect={handleWalletConnect}
        isConnecting={isConnectingWallet}
      />
    </>
  );
}
