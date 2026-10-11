'use client';

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { submitSupportRequest } from "@/services/supporterService";
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/BackButton";
import { FaCopy, FaCheck, FaEthereum } from 'react-icons/fa';
import { SiKofi, SiSolana } from 'react-icons/si';
import { BiLogoBitcoin } from "react-icons/bi";
import { FiChevronDown, FiCheck as FiCheckIcon } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

export default function SupportUsClient() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("Ko-fi");
  const [proof, setProof] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
        setIsPlatformDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [copiedSolana, setCopiedSolana] = useState(false);
  const [copiedEVM, setCopiedEVM] = useState(false);

  const handleCopy = (text: string, type: 'solana' | 'evm') => {
    navigator.clipboard.writeText(text);
    if (type === 'solana') {
      setCopiedSolana(true);
      setTimeout(() => setCopiedSolana(false), 2000);
    } else {
      setCopiedEVM(true);
      setTimeout(() => setCopiedEVM(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Name is required.");
      return;
    }

    if (url) {
      try {
        const link = new URL(url);
        if (link.protocol !== 'https:' && link.protocol !== 'http:') throw new Error('Invalid URL');
      } catch {
        toast.error("Enter a valid HTTP or HTTPS link.");
        return;
      }
    }

    if (platform === "Ko-fi" && !proof.trim()) {
      toast.error("Ko-fi URL is required.");
      return;
    }
    if (platform === "Crypto" && !proof.trim()) {
      toast.error("Crypto transaction URL is required.");
      return;
    }
    if (platform === "Ko-fi") {
      try {
        const profile = new URL(proof);
        if (profile.protocol !== "https:" || profile.hostname.toLowerCase() !== "ko-fi.com" || profile.port || profile.username || profile.password || proof !== proof.trim() || proof.length > 2048) {
          throw new Error("Invalid profile");
        }
      } catch {
        toast.error("Enter a Ko-fi URL, such as https://ko-fi.com/username.");
        return;
      }
    }
    if (platform === "Crypto") {
      try {
        const transaction = new URL(proof);
        if (!['http:', 'https:'].includes(transaction.protocol) || transaction.username || transaction.password || proof !== proof.trim()) {
          throw new Error("Invalid transaction URL");
        }
      } catch {
        toast.error("Enter a valid Crypto transaction URL.");
        return;
      }
    }

    if (!turnstileToken) {
      toast.error("Please verify that you are a human.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSupportRequest(name, url, platform, proof, turnstileToken);
      toast.success("Support submitted successfully.");
      
      setName("");
      setUrl("");
      setPlatform("Ko-fi");
      setProof("");
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <BackButton fallbackUrl="/activity" label="Back to Activity" forceFallback />

        <div className="mt-8 mb-12 flex flex-col items-start text-left space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
            /submit-support-details
          </h1>
          <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
            If you&apos;d like your name to be displayed on our public supporters list, submit this form after supporting us (optional).
          </p>
        </div>

        {/* Static Methods Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="relative glass-card rounded-2xl p-6 flex flex-col h-full bg-card-color/80 backdrop-blur-xl border border-[var(--border-divider)]">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <SiKofi className="text-[#FF5E5B]" /> Ko-fi
            </h2>
            <p className="text-fill-color/70 text-sm mb-6 flex-grow">
              Support us by buying a coffee. Ko-fi is a friendly and simple way to directly fund creators and support their ongoing work.
            </p>
            <a 
              href="https://ko-fi.com/nwwonee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full text-center px-4 py-3 bg-[#FF5E5B] hover:bg-[#FF5E5B]/90 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Support via Ko-fi
            </a>
          </div>

          <div className="relative glass-card rounded-2xl p-6 flex flex-col h-full bg-card-color/80 backdrop-blur-xl border border-[var(--border-divider)]">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BiLogoBitcoin className="text-[#F7931A]" /> Crypto
            </h2>
            <p className="text-fill-color/70 text-sm mb-6 flex-grow">
              Send tokens directly to our addresses on Solana or EVM networks.
            </p>
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex items-center justify-between p-3 bg-[rgba(var(--fill-color-rgb),0.05)] border border-[var(--border-divider)] rounded-xl w-full">
                <div className="flex items-center gap-2">
                  <SiSolana className="text-[#14F195]" />
                  <span className="text-sm font-semibold">Solana</span>
                </div>
                <button 
                  onClick={() => handleCopy('FSrM2wHhHibFbK5S1oHsWG1PDQzj1soLSn2CNnMhCjWi', 'solana')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[rgba(var(--fill-color-rgb),0.05)] hover:bg-[rgba(var(--fill-color-rgb),0.1)] rounded-lg transition-colors border border-[var(--border-divider)] cursor-pointer"
                >
                  {copiedSolana ? <><FaCheck className="text-green-500" /> Copied</> : <><FaCopy className="text-fill-color/60" /> Copy Address</>}
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-[rgba(var(--fill-color-rgb),0.05)] border border-[var(--border-divider)] rounded-xl w-full">
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-[#627EEA]" />
                  <span className="text-sm font-semibold">EVM</span>
                </div>
                <button 
                  onClick={() => handleCopy('0x1fCD05ACED7295baCd96A4dfAA43E3055c70CF2E', 'evm')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[rgba(var(--fill-color-rgb),0.05)] hover:bg-[rgba(var(--fill-color-rgb),0.1)] rounded-lg transition-colors border border-[var(--border-divider)] cursor-pointer"
                >
                  {copiedEVM ? <><FaCheck className="text-green-500" /> Copied</> : <><FaCopy className="text-fill-color/60" /> Copy Address</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Support Form */}
        <div className="mb-16">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-fill-color">Name (display name) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or username"
                className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-fill-color">Link <span className="text-fill-color/40 font-normal">(optional)</span></label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite or social link"
                className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-fill-color">Platform <span className="text-red-500">*</span></label>
              <div className="relative w-full" ref={platformDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                  className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 cursor-pointer
                      ${isPlatformDropdownOpen ? 'bg-blue-500/20 text-fill-color border border-blue-500/50' : 'bg-[rgba(var(--fill-color-rgb),0.03)] text-fill-color border border-[var(--border-divider)] hover:border-blue-500'}
                  `}
                >
                  <span className="text-base">{platform}</span>
                  <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${isPlatformDropdownOpen ? 'rotate-180 text-blue-400' : 'text-fill-color/50'}`} />
                </button>
                {isPlatformDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl bg-[var(--card-color)] border border-[var(--border-divider)] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                      <div className="flex flex-col p-2 space-y-1">
                          {["Ko-fi", "Crypto"].map((opt) => (
                              <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                      if (platform !== opt) setProof("");
                                      setPlatform(opt);
                                      setIsPlatformDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${platform === opt
                                          ? 'bg-blue-500/20 text-blue-400 font-medium'
                                          : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                      }`}
                              >
                                  <div className="flex items-center gap-2 text-base">
                                      {opt === "Ko-fi" && <SiKofi className={platform === opt ? "" : "text-[#FF5E5B]"} />}
                                      {opt === "Crypto" && <BiLogoBitcoin className={platform === opt ? "" : "text-[#F7931A]"} />}
                                      <span>{opt}</span>
                                  </div>
                                  {platform === opt && <FiCheckIcon className="w-5 h-5" />}
                              </button>
                          ))}
                      </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex flex-col space-y-2"
                >
                  <label htmlFor="support-reference" className="text-sm font-semibold text-fill-color">
                    {platform === "Ko-fi" ? "Ko-fi URL" : "Crypto transaction URL"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="support-reference"
                    type="url"
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    placeholder={platform === "Ko-fi" ? "https://ko-fi.com/username" : "https://etherscan.io/tx/0x5f..."}
                    autoComplete="off"
                    required
                    className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-start gap-5">
              <div className="order-1 sm:order-2 flex-shrink-0 flex justify-center w-full sm:w-auto">
                 <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken("")}
                    onExpire={() => setTurnstileToken("")}
                 />
              </div>
              <button
                type="submit"
                disabled={!turnstileToken || isSubmitting}
                className="order-2 sm:order-1 px-6 py-3 rounded-xl font-medium text-[15px] text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer w-full sm:w-fit"
              >
                {isSubmitting ? (
                  <Spinner className="w-5 h-5 text-white" />
                ) : (
                  "Submit Details"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}