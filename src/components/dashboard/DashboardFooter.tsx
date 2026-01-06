import { Github, Twitter, MessageCircle } from "lucide-react";
import { HoloLogo } from "@/components/HoloLogo";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export function DashboardFooter() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm px-4 md:px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left - Brand & Copyright */}
        <div className="flex items-center gap-3">
          <HoloLogo size="sm" showText={false} />
          <span className="text-tiny text-muted-foreground">
            © 2024 Yielder. All rights reserved.
          </span>
        </div>

        {/* Center - Quick Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-tiny text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="#" className="text-tiny text-muted-foreground hover:text-foreground transition-colors">
            API
          </a>
          <a href="#" className="text-tiny text-muted-foreground hover:text-foreground transition-colors">
            Support
          </a>
          <a href="#" className="text-tiny text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
        </div>

        {/* Right - Social Links */}
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}