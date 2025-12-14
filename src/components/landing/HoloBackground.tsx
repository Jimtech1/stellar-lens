import { memo } from "react";

interface HoloBackgroundProps {
  variant?: "default" | "subtle" | "intense";
  className?: string;
}

// Optimized holographic background using CSS animations instead of framer-motion
export const HoloBackground = memo(function HoloBackground({ variant = "default", className = "" }: HoloBackgroundProps) {
  const intensityMap = {
    subtle: { opacity: 0.15, blur: 80 },
    default: { opacity: 0.25, blur: 60 },
    intense: { opacity: 0.35, blur: 50 },
  };

  const config = intensityMap[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* CSS-animated holographic orbs - no JS animations */}
      <div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full animate-holo-float-1"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-cyan) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
          willChange: 'transform',
        }}
      />
      
      <div
        className="absolute top-1/4 -right-20 w-[350px] h-[350px] rounded-full animate-holo-float-2"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-purple) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
          willChange: 'transform',
        }}
      />
      
      <div
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full animate-holo-float-3"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-blue) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
          willChange: 'transform',
        }}
      />
      
      <div
        className="absolute bottom-20 right-1/3 w-[250px] h-[250px] rounded-full animate-holo-float-4"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-pink) / ${config.opacity * 0.8}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
          willChange: 'transform',
        }}
      />

      {/* Holographic grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--holo-blue)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--holo-blue)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Simplified shimmer effect */}
      <div
        className="absolute inset-0 animate-holo-shimmer"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            hsl(var(--holo-cyan) / 0.03) 25%,
            hsl(var(--holo-purple) / 0.03) 50%,
            hsl(var(--holo-pink) / 0.03) 75%,
            transparent 100%
          )`,
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
});
