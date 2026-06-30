'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { FaXTwitter, FaInstagram, FaThreads } from "react-icons/fa6";

export default function Footer() {
    const textContainerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-9999);
    const mouseY = useMotionValue(-9999);
    const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.8 });
    const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.8 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!textContainerRef.current) return;
            const rect = textContainerRef.current.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
            if (isInside) {
                setIsHovering(true);
                mouseX.set(x - rect.left);
                mouseY.set(y - rect.top);
            } else {
                setIsHovering(false);
                mouseX.set(-9999);
                mouseY.set(-9999);
            }
        };

        const handleMouseLeaveWindow = () => {
            setIsHovering(false);
            mouseX.set(-9999);
            mouseY.set(-9999);
        };

        window.addEventListener("mousemove", handleGlobalMouseMove, true);
        document.addEventListener("mouseleave", handleMouseLeaveWindow);
        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove, true);
            document.removeEventListener("mouseleave", handleMouseLeaveWindow);
        };
    }, [mouseX, mouseY]);

    const brightMask = useMotionTemplate`radial-gradient(circle 130px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;
    const glowMask = useMotionTemplate`radial-gradient(circle 180px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        const el = document.getElementById(id);
        if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
                <footer className="relative py-10 mt-20 overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-600/30 after:via-blue-500/10 after:to-transparent after:pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
                    {/* Left Section */}
                    <div className="flex flex-col items-start space-y-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src="https://nekowawolf.github.io/cdn-images/images/2026/1768368937_logo.jpg"
                                alt="Logo"
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-500/20"
                            />
                            <span className="text-2xl font-extrabold text-fill-color">Nww</span>
                        </div>
                        <p className="text-fill-color/70 max-w-[280px] text-sm leading-relaxed">
                            Exploring, building, and connecting the digital landscape.
                        </p>
                        <div className="flex flex-col space-y-6 mt-4">
                            <div className="flex items-center space-x-4">
                                <a href="https://x.com/nwwonee" target="_blank" rel="noopener noreferrer" className="p-3 bg-[rgba(var(--fill-color-rgb),0.05)] hover:bg-[rgba(var(--fill-color-rgb),0.1)] border border-[var(--border-divider)] rounded-xl transition-all duration-300 text-fill-color hover:-translate-y-1 shadow-sm opacity-70 hover:opacity-100">
                                    <FaXTwitter className="text-lg" />
                                </a>
                                <a href="https://instagram.com/nwwonee" target="_blank" rel="noopener noreferrer" className="p-3 bg-[rgba(var(--fill-color-rgb),0.05)] hover:bg-[rgba(var(--fill-color-rgb),0.1)] border border-[var(--border-divider)] rounded-xl transition-all duration-300 text-fill-color hover:-translate-y-1 shadow-sm opacity-70 hover:opacity-100">
                                    <FaInstagram className="text-lg" />
                                </a>
                                <a href="https://threads.net/@nwwonee" target="_blank" rel="noopener noreferrer" className="p-3 bg-[rgba(var(--fill-color-rgb),0.05)] hover:bg-[rgba(var(--fill-color-rgb),0.1)] border border-[var(--border-divider)] rounded-xl transition-all duration-300 text-fill-color hover:-translate-y-1 shadow-sm opacity-70 hover:opacity-100">
                                    <FaThreads className="text-lg" />
                                </a>
                            </div>
                            <div className="text-sm text-fill-color/60">
                                &copy; {new Date().getFullYear()} Nww GitHub Repos.
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col w-full md:w-auto md:min-w-[200px]">
                        <h4 className="text-lg font-bold text-fill-color uppercase tracking-widest mb-6">/ECOSYSTEM</h4>
                        <div className="flex flex-col space-y-4 items-start font-mono text-sm">
                            <a
                                href="https://airdrop.nekowawolf.xyz"
                                target="_blank"
                                className="flex items-center group text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 mr-3 text-fill-color/30 flex-shrink-0 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 2v14h14" />
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">/Airdrops</span>
                            </a>
                            <a
                                href="https://cc.nekowawolf.xyz/"
                                target="_blank"
                                className="flex items-center group text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 mr-3 text-fill-color/30 flex-shrink-0 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 2v14h14" />
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">/Crypto Community</span>
                            </a>
                            <a
                                href="https://web3.nekowawolf.xyz/"
                                target="_blank"
                                className="flex items-center group text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 mr-3 text-fill-color/30 flex-shrink-0 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 2v14h14" />
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">/Web3 Tools</span>
                            </a>
                            <a
                                href="https://ai.nekowawolf.xyz/"
                                target="_blank"
                                className="flex items-center group text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 mr-3 text-fill-color/30 flex-shrink-0 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 2v14h14" />
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">/AI Tools</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Separator line */}
                <div className="w-full border-t border-gray-500/20 mt-12 mb-8"></div>
            </div>

            {/* Giant Text with flashlight effect */}
            <div
                ref={textContainerRef}
                className="relative w-full flex justify-center cursor-default select-none overflow-hidden"
            >
                {/* Layer 1: Default text */}
                <div className="flex justify-center items-center select-none pointer-events-none">
                    <h3 className="text-[9vw] font-black text-fill-color opacity-10 tracking-tighter whitespace-nowrap">
                            NWW GITHUB REPOS
                        </h3>
                </div>

                {/* Layer 2: Bright text with spotlight mask */}
                <motion.div
                    className="absolute inset-0 flex justify-center items-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                        maskImage: brightMask,
                        WebkitMaskImage: brightMask,
                    }}
                >
                    <motion.h3 className="text-[9vw] font-black text-blue-600 tracking-tighter whitespace-nowrap">
                            NWW GITHUB REPOS
                        </motion.h3>
                </motion.div>

                {/* Layer 3: Glow layer */}
                <motion.div
                    className="absolute inset-0 flex justify-center items-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 0.6 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                        maskImage: glowMask,
                        WebkitMaskImage: glowMask,
                    }}
                >
                    <motion.h3 className="text-[9vw] font-black text-blue-500 tracking-tighter blur-[12px] whitespace-nowrap">
                            NWW GITHUB REPOS
                        </motion.h3>
                </motion.div>
            </div>
        </footer>
    );
}