'use client';

export default function Footer() {
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
            <div className="max-w-7xl mx-auto px-4">
                {/* Large Text */}
                <div className="flex justify-center items-center select-none pointer-events-none">
                    <h3 className="text-[9vw] sm:text-[10vw] font-black text-fill-color opacity-10 mx-2 tracking-tighter">
                        NWW
                    </h3>
                    <h3 className="text-[9vw] sm:text-[10vw] font-black text-fill-color opacity-10 mx-2 tracking-tighter">
                        REPOS
                    </h3>
                </div>

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