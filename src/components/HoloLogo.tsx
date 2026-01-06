import { cn } from "@/lib/utils";

interface HoloLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function HoloLogo({ size = "md", showText = true, className }: HoloLogoProps) {
  const sizeClasses = {
    sm: { container: "w-6 h-6", text: "text-xs", logoText: "text-base", glow: "shadow-[0_0_12px_2px]" },
    md: { container: "w-8 h-8", text: "text-lg", logoText: "text-lg", glow: "shadow-[0_0_16px_3px]" },
    lg: { container: "w-10 h-10", text: "text-xl", logoText: "text-xl", glow: "shadow-[0_0_20px_4px]" },
  };

  const config = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Holographic Logo Icon */}
      <div
        className={cn(
          config.container,
          config.glow,
          "relative rounded-lg flex items-center justify-center overflow-hidden shrink-0",
          "shadow-[hsl(var(--holo-purple))]",
          "animate-[holoPulse_2s_ease-in-out_infinite]"
        )}
        style={{
          boxShadow: `0 0 16px 2px hsl(var(--holo-cyan) / 0.5), 0 0 32px 4px hsl(var(--holo-purple) / 0.3)`,
        }}
      >
        {/* Animated holographic background */}
        <div 
          className="absolute inset-0 animate-[holoGradient_3s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(
              135deg,
              hsl(var(--holo-cyan)) 0%,
              hsl(var(--holo-blue)) 25%,
              hsl(var(--holo-purple)) 50%,
              hsl(var(--holo-pink)) 75%,
              hsl(var(--holo-cyan)) 100%
            )`,
            backgroundSize: '300% 300%',
          }}
        />
        
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 animate-[holoShimmerFast_2s_linear_infinite]"
          style={{
            background: `linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            )`,
            backgroundSize: '200% 100%',
          }}
        />
        
        {/* Inner glow ring */}
        <div className="absolute inset-[2px] rounded-md bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Letter */}
        <span 
          className={cn("relative z-10 font-bold text-white", config.text)}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.5)',
          }}
        >
          Y
        </span>
      </div>

      {/* Holographic Text */}
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight animate-[holoTextGradient_4s_ease-in-out_infinite]",
            config.logoText
          )}
          style={{
            background: `linear-gradient(
              90deg,
              hsl(var(--holo-cyan)) 0%,
              hsl(var(--holo-blue)) 20%,
              hsl(var(--holo-purple)) 40%,
              hsl(var(--holo-pink)) 60%,
              hsl(var(--holo-purple)) 80%,
              hsl(var(--holo-cyan)) 100%
            )`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Yielder
        </span>
      )}
    </div>
  );
}
