'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaXTwitter, FaSun, FaMoon } from 'react-icons/fa6';
import { HiOutlineX } from 'react-icons/hi';
import { FaGithub, FaTelegram, FaBars } from 'react-icons/fa';
import { toggleDarkMode } from '@/utils/darkmode';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      if (isMenuOpen) {
        setHidden(false);

        if (Math.abs(y - lastScrollY) > 10) {
          setIsMenuOpen(false);
        }

        lastScrollY = y;
        return;
      }

      if (y > lastScrollY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = y;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  const onToggleTheme = () => {
    toggleDarkMode();
  };

  return (
    <>
      {/* HEADER */}
      <header
         className={`
            fixed top-4 left-0 right-0 z-50 px-3 sm:px-6
            transform transition-all duration-500 ease-in-out
            will-change-transform
            ${hidden ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
        <div
          className={`
            max-w-4xl mx-auto
            h-14 sm:h-16
            rounded-full overflow-hidden
            border border-color navbar-color backdrop-blur-md
            ${scrolled ? 'shadow-lg' : 'shadow-none'}
          `}
        >
          <div className="h-full px-6 sm:px-8 flex items-center justify-between">
            {/* LEFT */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://nekowawolf.github.io/cdn-images/images/2026/1768368937_logo.jpg"
              alt="Logo"
              className="h-8 sm:h-10 w-auto rounded-[5px]"
            />
            <span className="font-extrabold text-xl sm:text-2xl text-fill-color">
              Nww
            </span>
          </Link>

            {/* NAVIGATION */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/github-repos"
                className="text-fill-color/70 font-semibold hover:!text-blue-600 transition-colors duration-300"
              >
                GitHub Repos
              </Link>
              <Link
                href="https://airdrop.nekowawolf.xyz" target="_blank"
                className="text-fill-color/70 font-semibold hover:!text-blue-600 transition-colors duration-300"
              >
                Airdrops
              </Link>
              <Link
                href="https://ai.nekowawolf.xyz/" target="_blank"
                className="text-fill-color/70 font-semibold hover:!text-blue-600 transition-colors duration-300"
              >
                AI Tools
              </Link>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
              {/* SOCIAL + DARK MODE + BURGER MENU */}
              <Link
                href="https://github.com/nekowawolf/" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color hidden sm:flex items-center justify-center hover:opacity-80"
              >
                <FaGithub />
              </Link>
              <Link
                href="https://t.me/nekowawolf" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color hidden sm:flex items-center justify-center hover:opacity-80"
              >
                <FaTelegram />
              </Link>
              <Link
                href="https://x.com/nekowawolf_" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color hidden sm:flex items-center justify-center hover:opacity-80"
              >
                <FaXTwitter />
              </Link>

                <button
                aria-label="Toggle dark mode"
                onClick={onToggleTheme}
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color flex items-center justify-center text-lg hover:opacity-80 cursor-pointer"
              >
                <FaSun className="theme-icon-sun" />
                <FaMoon className="theme-icon-moon" />
              </button>

              <button
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen((v) => !v)}
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color flex items-center justify-center text-lg sm:hidden"
              >
                {isMenuOpen ? <HiOutlineX size={22} /> : <FaBars />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="fixed top-[5.5rem] left-0 right-0 z-40 px-3 sm:hidden">
          <div className="max-w-7xl mx-auto rounded-xl border border-color navbar-color shadow-lg p-4 space-y-4">
            <Link
              href="/github-repos"
              onClick={() => setIsMenuOpen(false)}
              className="block font-semibold text-fill-color/70 hover:!text-blue-600 transition-colors duration-300"
            >
              GitHub Repos
            </Link>
            <Link
              href="https://airdrop.nekowawolf.xyz" target="_blank"
              onClick={() => setIsMenuOpen(false)}
              className="block font-semibold text-fill-color/70 hover:!text-blue-600 transition-colors duration-300"
            >
              Airdrops
            </Link>
            <Link
              href="https://ai.nekowawolf.xyz/" target="_blank"
              onClick={() => setIsMenuOpen(false)}
              className="block font-semibold text-fill-color/70 hover:!text-blue-600 transition-colors duration-300"
            >
              AI Tools
            </Link>

            <div className="flex gap-3 pt-2">
              <Link
                href="https://github.com/nekowawolf/" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color flex items-center justify-center"
              >
                <FaGithub />
              </Link>
              <Link
                href="https://t.me/nekowawolf" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color flex items-center justify-center"
              >
                <FaTelegram />
              </Link>
              <Link
                href="https://x.com/nekowawolf_" target="_blank"
                className="card-color w-9 h-9 text-fill-color rounded-full border border-color flex items-center justify-center"
              >
                <FaXTwitter />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}