import { motion } from "framer-motion";

interface HoloBackgroundProps {
  variant?: "default" | "subtle" | "intense";
  className?: string;
}

export function HoloBackground({ variant = "default", className = "" }: HoloBackgroundProps) {
  const intensityMap = {
    subtle: { opacity: 0.15, blur: 80 },
    default: { opacity: 0.25, blur: 60 },
    intense: { opacity: 0.35, blur: 50 },
  };

  const config = intensityMap[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Animated holographic orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-cyan) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/4 -right-20 w-[350px] h-[350px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-purple) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
        }}
      />
      
      <motion.div
        animate={{
          x: [0, 25, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-blue) / ${config.opacity}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -20, 35, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute bottom-20 right-1/3 w-[250px] h-[250px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--holo-pink) / ${config.opacity * 0.8}) 0%, transparent 70%)`,
          filter: `blur(${config.blur}px)`,
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

      {/* Holographic shimmer effect */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02],
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
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
}
