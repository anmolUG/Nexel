"use client";
import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const InfiniteMovingLogos = ({
  items,
  direction = "left",
  speed = "fast",
  className,
}: {
  items: { name: string; icon: React.ReactNode }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}) => {
  // Duplicate items twice to ensure a perfectly seamless loop on ultra-wide screens
  const duplicatedItems = [...items, ...items, ...items, ...items];
  
  const duration = speed === "fast" ? 15 : speed === "normal" ? 30 : 60;

  return (
    <div
      className={cn(
        "relative z-20 w-full overflow-hidden flex items-center justify-center border-y border-neutral-900 bg-black py-10",
        className
      )}
    >
      {/* Edge Gradients for Smooth In/Out Fading */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap items-center min-w-max gap-20 px-10"
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 text-neutral-400 font-bold text-2xl tracking-tight opacity-60 hover:opacity-100 transition-opacity cursor-default"
          >
            <div className="text-neutral-300">
              {item.icon}
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
