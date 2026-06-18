'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

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
            {/* Giant Text with flashlight effect */}
            <div 
                ref={textContainerRef}
                className="relative w-full flex justify-center cursor-default select-none overflow-hidden"
            >
                    {/* Layer 1: Default text */}
                    <div className="flex justify-center items-center select-none pointer-events-none">
                        <h3 className="text-[9vw] sm:text-[10vw] font-black text-fill-color opacity-10 mx-2 tracking-tighter">
                            NWW
                        </h3>
                        <h3 className="text-[9vw] sm:text-[10vw] font-black text-fill-color opacity-10 mx-2 tracking-tighter">
                            GITHUB REPOS
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
                        <motion.h3 className="text-[9vw] sm:text-[10vw] font-black text-blue-600 mx-2 tracking-tighter">
                            NWW
                        </motion.h3>
                        <motion.h3 className="text-[9vw] sm:text-[10vw] font-black text-blue-600 mx-2 tracking-tighter">
                            GITHUB REPOS
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
                        <motion.h3 className="text-[9vw] sm:text-[10vw] font-black text-blue-500 mx-2 tracking-tighter blur-[12px]">
                            NWW
                        </motion.h3>
                        <motion.h3 className="text-[9vw] sm:text-[10vw] font-black text-blue-500 mx-2 tracking-tighter blur-[12px]">
                            GITHUB REPOS
                        </motion.h3>
                    </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Links */}
                <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-fill-color/60 border-t border-white/5 pt-8">

                    <p className="order-2 md:order-1 mt-8 md:mt-0 text-center md:text-left">
                        &copy; Nww GitHub Repos, 2026.
                    </p>

                    <div className="order-1 md:order-2 flex space-x-6 mt-4 md:mt-0">
                        <a
                            href="https://airdrop.nekowawolf.xyz"
                            target="_blank"
                            className="text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                        >
                            Airdrops
                        </a>
                        <a
                            href="https://cc.nekowawolf.xyz/"
                            target="_blank"
                            className="text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                        >
                            Community
                        </a>
                        <a
                            href="https://web3.nekowawolf.xyz/"
                            target="_blank"
                            className="text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                        >
                            Web3 Tools
                        </a>
                        <a
                            href="https://ai.nekowawolf.xyz/"
                            target="_blank"
                            className="text-fill-color/60 hover:!text-blue-600 transition-colors duration-300"
                        >
                            AI Tools
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}