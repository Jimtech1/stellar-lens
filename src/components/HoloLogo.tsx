import { cn } from "@/lib/utils";

interface HoloLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function HoloLogo({ size = "md", showText = true, className }: HoloLogoProps) {
  const sizeClasses = {
    sm: { container: "w-6 h-6", text: "text-xs", logoText: "text-base" },
    md: { container: "w-8 h-8", text: "text-lg", logoText: "text-lg" },
    lg: { container: "w-10 h-10", text: "text-xl", logoText: "text-xl" },
  };

  const config = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Holographic Logo Icon */}
      <div
        className={cn(
          config.container,
          "relative rounded-lg flex items-center justify-center overflow-hidden shrink-0"
        )}
      >
        {/* Animated holographic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--holo-cyan))] via-[hsl(var(--holo-purple))] to-[hsl(var(--holo-pink))] animate-holo-shimmer" 
          style={{ backgroundSize: '200% 200%' }}
        />
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-[holoShift_3s_ease-in-out_infinite]" />
        
        {/* Letter */}
        <span className={cn("relative z-10 font-bold text-white drop-shadow-sm", config.text)}>
          Y
        </span>
      </div>

      {/* Holographic Text */}
      {showText && (
        <span
          className={cn(
            "font-semibold bg-gradient-to-r from-[hsl(var(--holo-cyan))] via-[hsl(var(--holo-purple))] to-[hsl(var(--holo-pink))] bg-clip-text text-transparent bg-[length:200%_200%] animate-holo-shimmer",
            config.logoText
          )}
        >
          Yielder
        </span>
      )}
    </div>
  );
}
