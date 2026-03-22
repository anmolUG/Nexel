"use client";
import React, { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { InfiniteMovingLogos } from "@/components/ui/infinite-moving-logos";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Github, Zap, Cloud, Layers, Globe, Box, Database, Server, Flame, Activity, LayoutDashboard, Settings, User } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const stackLogos = [
    { name: "Next.js", icon: <Globe size={28} /> },
    { name: "TypeScript", icon: <Layers size={28} /> },
    { name: "Docker", icon: <Box size={28} /> },
    { name: "AWS ECS", icon: <Cloud size={28} /> },
    { name: "Apache Kafka", icon: <Zap size={28} /> },
    { name: "Redis", icon: <Server size={28} /> },
    { name: "AWS S3", icon: <Database size={28} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-sky-500/30">
      {/* Hero Section */}
      <div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <ShootingStars />
        <h1 className="md:text-[4.5rem] text-5xl lg:text-[5.5rem] font-bold text-center text-white relative z-20 tracking-tight leading-tight">
          Deploy your websites <br/>
          at{" "}
          <motion.span 
            className="relative inline-block cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            animate={isHovering ? { 
              scale: 0.85, 
              x: [0, 2, -2, 1, -1, 2, -2, 0], 
              y: [0, -2, 2, -1, 1, -2, 2, 0] 
            } : { scale: 1, x: 0, y: 0 }}
            transition={isHovering 
              ? { 
                  scale: { duration: 1.5, ease: "easeOut" },
                  x: { duration: 0.1, repeat: Infinity, ease: "linear" },
                  y: { duration: 0.1, repeat: Infinity, ease: "linear" }
                } 
              : { duration: 0.3 }}
          >
            <div className="absolute inset-0 -mx-4 -my-4 overflow-hidden pointer-events-none mix-blend-screen">
              <SparklesCore
                id="tsparticles-speed"
                background="transparent"
                minSize={0.4}
                maxSize={1.4}
                particleDensity={isHovering ? 250 : 80}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={isHovering ? 8 : undefined}
              />
            </div>
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              superfast speed
            </span>
          </motion.span>
        </h1>
        <p className="mt-8 text-neutral-300 relative z-20 text-lg md:text-xl text-center max-w-2xl px-4">
          The instant edge-deployment platform for React and Next.js. Push your code to the cloud in seconds.
        </p>
        <div className="mt-10 relative z-20 flex gap-4">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-neutral-200 text-lg px-8 py-6 rounded-full font-semibold"
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent text-white border-neutral-700 hover:bg-neutral-800 text-lg px-8 py-6 rounded-full font-semibold"
            onClick={() => window.open('https://github.com/anmolUG/Nexel', '_blank')}
          >
            <Github className="mr-2 h-5 w-5" />
            View Source
          </Button>
        </div>
      </div>

      {/* Infinite Logo Marquee Section */}
      <section className="w-full relative z-20 pb-20 pt-10 bg-black">
        <p className="text-center text-neutral-500 text-sm font-semibold tracking-widest uppercase mb-8">
          Powered by Industry-Leading Infrastructure
        </p>
        <InfiniteMovingLogos items={stackLogos} speed="slow" />
      </section>

      {/* Features / Bento Grid Section */}
      <section className="pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <AnimatedSectionHeader />

        <BentoGrid className="max-w-6xl mx-auto md:grid-cols-2 lg:auto-rows-[28rem] gap-8">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8"
        >
          Ready to deploy?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-neutral-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stop wrestling with complex cloud infrastructure. Connect your GitHub repository and let our automated streaming pipeline securely compile and deploy your code to the edge in seconds.
        </motion.p>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: false, margin: "-100px" }}
           transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent text-white border-neutral-700 hover:bg-neutral-800 text-lg px-10 py-8 rounded-full font-semibold transition-all hover:scale-[1.05]"
            onClick={() => router.push('/dashboard')}
          >
            Start Deploying Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 mt-12 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl leading-none">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Nexel Cloud</span>
          </div>
          <p className="text-neutral-500 text-sm">
            Powered by AWS, Docker, and Apache Kafka.
          </p>
        </div>
      </footer>
    </div>
  );
}

const AnimatedSectionHeader = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div ref={ref} className="mx-auto flex flex-col items-center justify-center mb-16 space-y-6">
      
      {/* Framed Title Box */}
      <div className="relative inline-flex items-center justify-center px-10 py-6">
        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-neutral-700" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-neutral-700" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-neutral-700" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-neutral-700" />

        {/* Animated Borders */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-[3px] left-2 right-2 h-[1px] bg-neutral-800 origin-left"
        />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-[3px] left-2 right-2 h-[1px] bg-neutral-800 origin-right"
        />
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isInView ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-2 bottom-2 left-[3px] w-[1px] bg-neutral-800 origin-top"
        />
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isInView ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-2 bottom-2 right-[3px] w-[1px] bg-neutral-800 origin-bottom"
        />

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center z-10"
        >
          Deployments made easy
        </motion.h2>
      </div>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-neutral-500 text-sm md:text-base max-w-sm text-center z-10 font-medium"
      >
        Deploy with ease, leave complexities to us.
      </motion.p>
    </div>
  );
};

const OneClickSkeleton = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[14rem] rounded-xl bg-neutral-950 border border-neutral-800 relative overflow-hidden items-center justify-center p-4">
      {/* Background wire circuit perfectly matching the screenshot */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 400 200">
        <path 
           d="M 120 -20 L 120 70 Q 120 100 150 100 L 250 100 Q 280 100 280 130 L 280 220" 
           stroke="rgba(255,255,255,0.1)" 
           strokeWidth="1.5" 
           fill="none" 
        />
        {/* The moving glowing blue segment */}
        <motion.path 
           d="M 120 -20 L 120 70 Q 120 100 150 100 L 250 100 Q 280 100 280 130 L 280 220" 
           stroke="#3b82f6" 
           strokeWidth="2" 
           fill="none" 
           strokeLinecap="round"
           strokeDasharray="20 500"
           initial={{ strokeDashoffset: 20 }}
           animate={{ strokeDashoffset: -400 }}
           transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="flex space-x-6 z-10 w-full justify-center relative">
        {/* Box 1: Terminal */}
        <div className="w-40 h-40 bg-[#2d2d2d] rounded-2xl border border-neutral-700/30 flex flex-col justify-center pl-4 pr-2 text-[11px] font-mono text-neutral-300 shadow-xl whitespace-nowrap overflow-hidden cursor-default">
          <p className="mb-2 text-white">git add .</p>
          <p className="mb-2 text-white">git commit -m "update"</p>
          <p className="text-white">git push</p>
        </div>
        
        {/* Box 2: Github */}
        <div className="w-40 h-40 bg-[#2d2d2d] rounded-2xl border border-neutral-700/30 flex items-center justify-center shadow-xl cursor-default hover:scale-105 transition-transform">
          <Github className="text-white h-14 w-14" />
        </div>
        
        {/* Box 3: AWS */}
        <div className="w-40 h-40 bg-[#2d2d2d] rounded-2xl border border-neutral-700/30 flex flex-col items-center justify-center shadow-xl cursor-default">
          <div className="flex flex-col items-center mb-2">
            <span className="text-white font-bold text-[28px] leading-none tracking-tighter">aws</span>
            <svg viewBox="0 0 100 30" width="45" height="15" className="mt-1">
              <path d="M 5 15 C 25 28 55 28 75 12" fill="none" stroke="#FF9900" strokeWidth="6" strokeLinecap="round" />
              <path d="M 62 10 L 78 10 L 73 25" fill="none" stroke="#FF9900" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[11px] text-white mt-1">your site is live</span>
        </div>
      </div>
    </div>
  );
};

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

const GlobeSkeleton = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  const globeConfig = {
    pointSize: 4,
    globeColor: "#000000",
    showAtmosphere: true,
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.15,
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(0, 136, 255, 0.9)", // Bright vivid neon blue dots
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 2,
    initialPosition: { lat: 35.0, lng: -90.0 }, // Angled down over US
    autoRotate: true,
    autoRotateSpeed: 3.5,
  };

  // Add a single location to spawn the large glowing ring visible in the screenshot
  const data = [
    {
      order: 1,
      startLat: 38.8951,
      startLng: -77.0364,
      endLat: 38.8951,
      endLng: -77.0364,
      arcAlt: 0.1,
      color: "#002fff", // Deep blue glow
    }
  ];

  return (
    <div ref={ref} className="flex flex-1 w-full h-full min-h-[14rem] rounded-xl bg-neutral-950 border border-neutral-600 relative overflow-hidden items-end justify-center transition-colors">
      {/* Embedded 3D Globe - switched to absolute rigid rem constraints to prevent Three.js flex-resizing loops causing massive blowout glitches */}
      <motion.div 
         initial={{ y: 80, opacity: 0 }}
         animate={isInView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
         transition={{ duration: 1.2, ease: "easeOut" }}
         className="absolute w-[40rem] h-[40rem] lg:w-[60rem] lg:h-[60rem] -bottom-[20rem] -right-[15rem] lg:-bottom-[30rem] lg:-right-[25rem] z-0 pointer-events-none mix-blend-screen drop-shadow-2xl"
      >
         <World globeConfig={globeConfig} data={data} />
      </motion.div>

      {/* Bottom inner shadow to ground the rendering softly to the edge */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-neutral-950 to-transparent z-20 pointer-events-none" />
    </div>
  );
};

const features = [
  {
    title: "One click deploy",
    description: "Deploy your app in seconds, with our one click deploy feature.",
    header: <OneClickSkeleton />,
    className: "md:col-span-1",
  },
  {
    title: <div className="-mt-3">Hosting over the edge</div>,
    description: "With our edge network, we host your website by going into each city by ourselves.",
    header: <GlobeSkeleton />,
    className: "md:col-span-1 flex flex-col-reverse space-y-reverse group/bento",
  },
];
