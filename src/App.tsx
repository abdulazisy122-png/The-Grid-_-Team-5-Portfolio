/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  ArrowRight, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Github, 
  ExternalLink,
  Menu,
  X,
  Cpu,
  Layers,
  Zap,
  Globe,
  Volume2,
  VolumeX,
  Gauge
} from 'lucide-react';
import { cn } from './lib/utils';

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Systems...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 100 ? 100 : next;
      });
    }, 150);

    const statusMessages = [
      "Warming up Engines...",
      "Calibrating Aerodynamics...",
      "Injecting High Octane Fuel...",
      "Synchronizing Grid Data...",
      "Final System Check...",
      "Ready to Race."
    ];

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < statusMessages.length) {
        setStatus(statusMessages[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(msgInterval);
      }
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(msgInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-charcoal flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Glitch Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="relative w-full max-w-md text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-accent/20 border-t-accent rounded-full mx-auto mb-12 flex items-center justify-center"
        >
          <Gauge className="text-accent" size={32} />
        </motion.div>

        <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-2">
          The <span className="text-accent">Grid</span>
        </h2>
        
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-accent shadow-[0_0_20px_#FF4500]"
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
          <span>{status}</span>
          <span className="text-accent">{progress}%</span>
        </div>
      </div>

      {/* Decorative Speed Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: [0, 1, 0] }}
            transition={{ 
              duration: 0.5 + Math.random(), 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
            className="absolute h-px bg-accent/30"
            style={{ 
              top: `${Math.random() * 100}%`, 
              width: `${100 + Math.random() * 200}px` 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex items-center gap-4">
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73456.mp3?filename=cyberpunk-2099-10701.mp3" 
      />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all group"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1 bg-accent text-[8px] font-black uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isMuted ? "Ignite Audio" : "Silence Engine"}
        </span>
      </motion.button>
    </div>
  );
};

// --- Micro-Interactions ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

const MagneticButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn("relative z-10", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const LiveStatus = () => (
  <div className="fixed top-8 right-8 z-[60] flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
    </span>
    <span className="text-[10px] font-black tracking-widest uppercase text-white/80">Currently Coding</span>
  </div>
);

const TechTicker = () => {
  const skills = ["React", "TypeScript", "GSAP", "Tailwind", "Motion", "Node.js", "Three.js", "Next.js"];
  
  return (
    <div className="w-full overflow-hidden bg-accent/10 border-y border-accent/20 py-4 mt-20">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex whitespace-nowrap gap-20"
      >
        {[...skills, ...skills, ...skills].map((skill, i) => (
          <span key={i} className="text-2xl font-display font-black uppercase tracking-tighter text-accent/50">
            {skill} <span className="text-white/20 ml-10">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.group') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const springConfig = { damping: 25, stiffness: 250 };
  const x = useSpring(mousePos.x - 16, springConfig);
  const y = useSpring(mousePos.y - 16, springConfig);

  return (
    <>
      <motion.div
        style={{ x, y }}
        className={cn(
          "fixed top-0 left-0 w-8 h-8 rounded-full border border-accent z-[9999] pointer-events-none mix-blend-difference transition-transform duration-300",
          isHovering && "scale-[2.5] bg-accent border-none",
          isClicking && "scale-[0.8]"
        )}
      />
      <motion.div
        style={{ 
          x: mousePos.x - 2, 
          y: mousePos.y - 2 
        }}
        className="fixed top-0 left-0 w-1 h-1 bg-accent rounded-full z-[9999] pointer-events-none"
      />
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-display font-black tracking-tighter flex items-center gap-2"
      >
        <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-white text-lg">G</div>
        THE GRID<span className="text-accent">.</span>
      </motion.div>
      
      <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em]">
        {['Team', 'Projects', 'Experience', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent transition-colors relative group">
            {item}
            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent transition-all group-hover:w-full" />
          </a>
        ))}
      </div>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Interactive Title Effect
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Layers */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/f1/1920/1080?grayscale" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Moving Scanning Line */}
        <motion.div 
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent z-10"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 border border-accent/30 rounded-full text-[10px] font-black tracking-[0.4em] uppercase text-accent mb-8 backdrop-blur-sm"
        >
          Est. 2025 / Creative Collective
        </motion.div>
        
        <div 
          className="relative cursor-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-huge font-display font-black uppercase leading-none select-none"
          >
            High <br />
            <span className="relative inline-block">
              <span className={cn(
                "text-accent italic transition-all duration-300",
                isHovered ? "opacity-0 scale-110 blur-sm" : "opacity-100"
              )}>
                Octane
              </span>
              
              {/* Glitch/Interactive Layer */}
              {isHovered && (
                <>
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute inset-0 text-accent italic skew-x-12 translate-x-1 translate-y-1 mix-blend-screen opacity-70"
                  >
                    Octane
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute inset-0 text-white italic -skew-x-12 -translate-x-1 -translate-y-1 mix-blend-difference opacity-50"
                  >
                    Octane
                  </motion.span>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute top-1/2 left-0 h-[2px] bg-accent z-20 shadow-[0_0_20px_#FF4500]"
                  />
                </>
              )}
            </span>
          </motion.h1>
        </div>
        
        <div className="mt-12">
          <MagneticButton className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-sm hover:bg-accent hover:text-white transition-colors flex items-center gap-4 mx-auto group">
            Ignite the Engine 
            <motion.div
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </MagneticButton>
        </div>
      </motion.div>

      <TechTicker />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
        <div className="w-px h-20 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  index: number;
  key?: string;
}

const TeamMember = ({ name, role, image, bio, index }: TeamMemberProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * (index % 2 === 0 ? 1 : -1), -50 * (index % 2 === 0 ? 1 : -1)]);

  return (
    <motion.div 
      ref={ref}
      style={{ y }}
      className={cn(
        "relative group overflow-hidden rounded-sm bg-white/5 border border-white/10 aspect-[3/4]",
        index % 2 !== 0 ? "md:mt-20" : ""
      )}
    >
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-110 group-hover:scale-100"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-90" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="overflow-hidden mb-4">
          <motion.p 
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            className="text-white/60 text-xs font-medium leading-relaxed italic"
          >
            "{bio}"
          </motion.p>
        </div>
        
        <div className="relative">
          <p className="text-accent text-[10px] uppercase font-black tracking-[0.3em] mb-2">{role}</p>
          <h3 className="text-3xl font-display font-black uppercase leading-none">{name}</h3>
          
          <div className="mt-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <Twitter size={18} className="cursor-pointer hover:text-accent" />
            <Instagram size={18} className="cursor-pointer hover:text-accent" />
            <Github size={18} className="cursor-pointer hover:text-accent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MeetTheTeam = () => {
  const team = [
    { name: "ROFA ANDINATA", role: "Lead Developer", bio: "Crafting pixel-perfect logic and high-performance architectures.", image: "https://lh3.googleusercontent.com/u/0/d/1fqL1lh6h-2mXC_am16SPs2monJIgF4HF" },
    { name: "ABIYYU AMEERI", role: "Creative Director", bio: "Designing intuitive interfaces that bridge the gap between emotion and tech.", image: "https://lh3.googleusercontent.com/u/0/d/1jyxHEvGZkJZOjDFQcdkXB99OLme28aC4" },
    { name: "RIDHO HANAFI", role: "Motion Artist", bio: "Bringing static pixels to life through fluid motion and cinematic storytelling.", image: "https://lh3.googleusercontent.com/u/0/d/1objhSQt59HZuBN0J9Z3of2exUV43ZpaY" },
    { name: "LUTHFI ADITYA", role: "Full Stack Dev", bio: "Defining the visual language and strategic vision for digital brands.", image: "https://lh3.googleusercontent.com/u/0/d/1eXo840iUnOgg5iLkfuSIfKYBkqwfS0Sp" },
    { name: "ABDUL AZIS", role: "UI/UX Designer", bio: "Building robust end-to-end solutions with a focus on scalability.", image: "https://lh3.googleusercontent.com/u/0/d/1RJ_JiK3imxqp9_mRFi_r_eA-J3nwxQXl" },
  ];

  return (
    <section id="team" className="py-40 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Live Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 6, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="absolute text-accent font-black text-2xl md:text-5xl"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          >
            +
          </motion.div>
        ))}
      </div>

      <div className="absolute -left-20 top-40 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none uppercase">
        Team
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
        <div className="md:col-span-1 flex flex-col justify-center">
          <h2 className="text-6xl md:text-8xl font-display font-black uppercase leading-[0.85] mb-8">
            The <br /> <span className="text-accent">Squad</span>
          </h2>
          <p className="text-white/40 max-w-sm font-medium leading-relaxed">
            A collective of specialists pushing the boundaries of what's possible in the digital realm.
          </p>
        </div>
        
        {team.slice(0, 2).map((member, i) => (
          <TeamMember key={member.name} {...member} index={i} />
        ))}
        
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {team.slice(2).map((member, i) => (
            <TeamMember key={member.name} {...member} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    { year: "2024", company: "BEM Arthakara", role: "Interactive Designer", icon: <Zap className="text-accent" /> },
    { year: "2024", company: "BEM Swarasakti", role: "Creative Designer", icon: <Cpu className="text-accent" /> },
    { year: "2025", company: "ASFERA 2025", role: "UI Designer", icon: <Layers className="text-accent" /> },
  ];

  return (
    <section id="experience" className="py-40 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Live Background: Circuit Lines */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`line-${i}`}
            className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent"
            style={{ left: `${(i + 1) * 12}%` }}
          />
        ))}
        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            animate={{ top: ["-20%", "120%"] }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity, 
              ease: "linear", 
              delay: Math.random() * 5 
            }}
            className="absolute w-[2px] h-32 bg-accent shadow-[0_0_15px_#FF4500]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <h2 className="text-4xl font-display font-black uppercase mb-20 tracking-tighter relative z-10">
        Track <span className="text-accent">Record</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {experiences.map((exp, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-10 group hover:border-accent/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              {exp.icon}
            </div>
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">{exp.year}</p>
            <h3 className="text-2xl font-display font-black uppercase mb-2">{exp.company}</h3>
            <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">{exp.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-300vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      pin.kill();
    };
  }, []);

  const projects = [
    { title: "ASFERA.OFFICIAL", category: "Web Design", stack: ["React", "Three.js", "GSAP"], image: "https://smait.assyifa-boardingschool.sch.id/wp-content/uploads/2025/05/photo_6102534523842578514_y.jpg" },
    { title: "ASFERA Teaser", category: "Motion", stack: ["After Effects", "C4D"], image: "https://i.ytimg.com/vi/FeAsJXnI3Is/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBdL7Q5OLsf1Ku-0nxp69cVlgnWpA" },
    { title: "ASFERA Poster", category: "Designer", stack: ["Fresco", "Illustrator"], image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUEUGoteTitAViQL04DldNQcGefaDBtswNUg&s" },
  ];

  return (
    <section id="projects" className="overflow-hidden bg-white text-black relative">
      {/* Live Background: Speed Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: ["-100%", "250%"] }}
            transition={{ 
              duration: 1 + Math.random() * 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 2
            }}
            className="absolute h-[2px] bg-black"
            style={{ 
              top: `${Math.random() * 100}%`, 
              width: `${150 + Math.random() * 400}px`,
              opacity: 0.2 + Math.random() * 0.8
            }}
          />
        ))}
      </div>

      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-screen w-[400vw] flex flex-row relative z-10">
          <div className="h-screen w-screen flex items-center justify-center p-20">
            <h2 className="text-huge font-display font-black uppercase tracking-tighter">
              The <br /> <span className="text-accent italic">Portfolio</span>
            </h2>
          </div>

          {projects.map((project, i) => (
            <div key={i} className="h-screen w-screen flex items-center justify-center p-10 md:p-20">
              <div className="relative w-full h-full max-w-6xl overflow-hidden rounded-sm group cursor-pointer">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/40 transition-all duration-500" />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-4 flex gap-2"
                  >
                    {project.stack.map(s => (
                      <span key={s} className="px-3 py-1 bg-black/50 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-full">
                        {s}
                      </span>
                    ))}
                  </motion.div>
                  <p className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-2">{project.category}</p>
                  <h3 className="text-6xl md:text-8xl font-display font-black uppercase leading-none">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-40 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute -bottom-20 left-0 w-full text-[30vw] font-black text-white/[0.02] select-none pointer-events-none uppercase whitespace-nowrap">
        The Grid
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-20 mb-40">
          <div className="max-w-md">
            <h2 className="text-6xl font-display font-black uppercase mb-10 tracking-tighter">Let's <br /> <span className="text-accent italic">Race.</span></h2>
            <p className="text-white/40 mb-12 font-medium leading-relaxed">We're always looking for new challenges and high-performance collaborations.</p>
            <MagneticButton className="px-10 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-sm hover:scale-105 transition-transform">
              Start a Project
            </MagneticButton>
          </div>
          
          <div className="grid grid-cols-2 gap-20">
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-accent mb-8">Socials</p>
              <ul className="space-y-6 font-black uppercase tracking-widest text-[10px]">
                <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-accent mb-8">Base</p>
              <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                London, UK <br />
                Creative Hub <br />
                E1 6HU
              </p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] uppercase font-black tracking-[0.5em] text-white/20">
            © 2025 THE GRID CREATIVE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[8px] uppercase font-black tracking-[0.5em] text-white/20">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const PageTransition = () => {
  return (
    <motion.div
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1, ease: [0.6, 0.05, -0.01, 0.9] }}
      style={{ originY: 0 }}
      className="fixed inset-0 bg-accent z-[100] pointer-events-none"
    />
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-charcoal text-white font-sans selection:bg-accent selection:text-white relative">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="fixed inset-0 bg-grain z-50 pointer-events-none" />
          <ScrollProgress />
          <LiveStatus />
          <AudioPlayer />
          <CustomCursor />
          <PageTransition />
          <Navbar />
          <main>
            <Hero />
            <MeetTheTeam />
            <Experience />
            <Projects />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
