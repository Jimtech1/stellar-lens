import { cn } from "@/lib/utils";

interface HoloLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function HoloLogo({ size = "md", showText = true, className }: HoloLogoProps) {
  const sizeClasses = {
    sm: { container: "w-7 h-7", text: "text-sm", logoText: "text-base", glow: "shadow-[0_0_15px_3px]" },
    md: { container: "w-9 h-9", text: "text-lg", logoText: "text-xl", glow: "shadow-[0_0_20px_4px]" },
    lg: { container: "w-11 h-11", text: "text-xl", logoText: "text-2xl", glow: "shadow-[0_0_25px_5px]" },
  };

  const config = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Holographic Logo Icon */}
      <div
        className={cn(
          config.container,
          "relative rounded-xl flex items-center justify-center overflow-hidden shrink-0",
          "animate-[holoPulse_2s_ease-in-out_infinite]"
        )}
        style={{
          boxShadow: `
            0 0 20px 4px hsl(var(--holo-blue) / 0.7), 
            0 0 40px 8px hsl(var(--holo-cyan) / 0.5),
            0 0 60px 12px hsl(var(--holo-blue) / 0.3),
            inset 0 0 10px 2px hsl(var(--holo-cyan) / 0.4)
          `,
        }}
      >
        {/* Animated holographic background */}
        <div 
          className="absolute inset-0 animate-[holoGradient_3s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(
              135deg,
              hsl(var(--holo-blue)) 0%,
              hsl(var(--holo-cyan)) 25%,
              hsl(var(--holo-blue)) 50%,
              hsl(var(--holo-cyan)) 75%,
              hsl(var(--holo-blue)) 100%
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
              rgba(255, 255, 255, 0.5) 50%,
              transparent 100%
            )`,
            backgroundSize: '200% 100%',
          }}
        />
        
        {/* Inner glow ring */}
        <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Letter */}
        <span 
          className={cn("relative z-10 font-bold text-white", config.text)}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 0 12px rgba(255,255,255,0.7)',
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
              hsl(var(--holo-blue)) 0%,
              hsl(var(--holo-cyan)) 25%,
              hsl(var(--holo-blue)) 50%,
              hsl(var(--holo-cyan)) 75%,
              hsl(var(--holo-blue)) 100%
            )`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px hsl(var(--holo-blue) / 0.6))',
          }}
        >
          Yielder
        </span>
      )}
    </div>
  );
}