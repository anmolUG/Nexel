"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
}

export const ShootingStars = () => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionIndex = useRef(0);

  useEffect(() => {
    const createStar = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      // Cycle sequentially through 3 distinct regions to guarantee perfect, rhythmic spacing
      const region = regionIndex.current;
      regionIndex.current = (regionIndex.current + 1) % 3;
      
      let startX = 0;
      let startY = 0;

      if (region === 0) {
        // Top Left / Center edge
        startX = -100 + Math.random() * (width / 2);
        startY = -100;
      } else if (region === 1) {
        // Top Right edge
        startX = width / 2 + Math.random() * (width / 2 + 200);
        startY = -100;
      } else {
        // Left edge (this guarantees shooting through the bottom left / middle)
        startX = -200;
        startY = Math.random() * height;
      }

      const newStar: ShootingStar = {
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        angle: 45, // perfectly straight trajectory for all stars
        scale: 2.5 + Math.random() * 1.0, // noticeably bigger base scale
        speed: 6, // uniform speed (6 seconds exactly) to prevent overlapping / bunching
        distance: width * 1.8 + Math.random() * 300,
      };

      setStars((prev) => [...prev, newStar]);
    };

    // Fire exactly 1 star consistently every single 1000ms. 
    // Since they take 6 seconds to cross, there will consistently be ~6 stars perfectly spaced.
    const interval = setInterval(createStar, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => {
        const finalX = star.x + Math.cos((star.angle * Math.PI) / 180) * star.distance;
        const finalY = star.y + Math.sin((star.angle * Math.PI) / 180) * star.distance;

        return (
          <motion.div
            key={star.id}
            initial={{
              x: star.x,
              y: star.y,
              opacity: 1,
              rotate: star.angle,
              scale: 0,
            }}
            animate={{
              x: finalX,
              y: finalY,
              opacity: 0,
              scale: star.scale,
            }}
            transition={{
              duration: star.speed,
              ease: "easeIn",
            }}
            onAnimationComplete={() => {
              setStars((prev) => prev.filter((s) => s.id !== star.id));
              
              // Trigger burst at the exact location it faded
              setBursts((prev) => [...prev, { id: star.id, x: finalX, y: finalY }]);
              setTimeout(() => {
                setBursts((prev) => prev.filter((b) => b.id !== star.id));
              }, 1200); // Clean up burst after animation finishes
            }}
            className="absolute"
          >
            {/* Star Head & Trail */}
            <div className="relative flex items-center">
              <div className="w-[180px] h-[3px] bg-gradient-to-r from-sky-400/0 via-sky-400 to-white rounded-full blur-[2px]"></div>
              <div className="w-[8px] h-[8px] rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.9)]"></div>
            </div>
          </motion.div>
        );
      })}

      {/* Render Impact Bursts */}
      {bursts.map((burst) => (
        <div 
          key={burst.id} 
          className="absolute" 
          style={{ left: burst.x, top: burst.y }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 80,
                y: (Math.random() - 0.5) * 80,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.7,
                ease: "easeOut",
              }}
              className="absolute w-[2px] h-[2px] rounded-full bg-sky-200 shadow-[0_0_4px_1px_rgba(186,230,253,0.8)]"
            />
          ))}
        </div>
      ))}
    </div>
  );
};
