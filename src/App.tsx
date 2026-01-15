import { motion } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import SpotlightText from "./components/SpotlightText";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Base colors (all grey)
  const baseColors = Array(14).fill("#9ca3af"); // grey-400 in hex

  // Highlight colors (bright rainbow)
  const highlightColors = [
    "#f87171",  // red-400
    "#fb923c",  // orange-400
    "#fbbf24",  // amber-400
    "#facc15",  // yellow-400
    "#a3e635",  // lime-400
    "#4ade80",  // green-400
    "#34d399",  // emerald-400
    "#2dd4bf",  // teal-400
    "#22d3ee",  // cyan-400
    "#38bdf8",  // sky-400
    "#60a5fa",  // blue-400
    "#818cf8",  // indigo-400
    "#a78bfa",  // violet-400
    "#c084fc",  // purple-400
  ];



  // Generate dense rain particles only once (fewer on mobile for performance)
  const dustParticles = useMemo(() =>
    Array.from({ length: isMobile ? 800 : 2000 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random distribution
      y: Math.random() * 100, // Random distribution
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.8 + 0.3,
      fallSpeed: Math.random() * 3 + 2,
    })), [isMobile]
  );



  return (
    <div
      ref={containerRef}
      className="h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-0"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 md:w-32 md:h-32 bg-gray-600 rounded-full opacity-10 blur-2xl md:blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-12 h-12 md:w-24 md:h-24 bg-slate-500 rounded-full opacity-15 blur-xl md:blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      {/* Main content container */}
      <div className="text-center z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Company name with spotlight effect */}
        <motion.div
          className="mb-8 md:mb-20 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <SpotlightText
            text="storymaster.ai"
            baseColors={baseColors}
            highlightColors={highlightColors}
            radius={isMobile ? 80 : 120}
            softEdge={isMobile ? 30 : 40}
            fontSize={isMobile ? "clamp(2rem, 12vw, 5rem)" : "clamp(5rem, 14vw, 20rem)"}
            gap="0px"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          className="text-center text-white space-y-1 md:space-y-2 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
        >
          <p className="text-sm md:text-lg tracking-wide leading-relaxed">
            real people | rpg mechanics | stats numbers | skills
          </p>
          <p className="text-sm md:text-lg tracking-wide">infinite story</p>
        </motion.div>
      </div>

      {/* Dense Rain particles - overlaying the content */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {dustParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-gray-600 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, window.innerHeight + 50],
            }}
            transition={{
              duration: particle.fallSpeed * 6,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 8,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="absolute left-0 right-0 text-center z-30"
        style={{ bottom: '16px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2, ease: "easeOut" }}
      >
        <p className="text-xs md:text-sm text-gray-500">(debut Spring 2026)</p>
      </motion.div>
    </div>
  );
}