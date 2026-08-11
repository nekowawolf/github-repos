'use client';

import { useState, useEffect, useRef } from "react";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";
import { fetchGithubReposData, submitGithubRepo } from "@/services/githubRepoService";
import { Turnstile } from '@marsidev/react-turnstile';
import { Spinner } from "@/components/ui/spinner";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LiaTimesCircleSolid } from "react-icons/lia";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function AddRepositoryClient() {
  const [repoUrl, setRepoUrl] = useState("");
  const [addedByName, setAddedByName] = useState("");
  const [addedByUrl, setAddedByUrl] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef<any>(null);



  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlExists, setUrlExists] = useState<boolean | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const repos = await fetchGithubReposData();
        const urls = repos.map(r => (r.repo_url || '').toLowerCase().replace(/\/$/, ''));
        setExistingUrls(urls);
      } catch (err) {
        console.error("Failed to load existing repos for validation", err);
      }
    };
    loadRepos();
  }, []);

  useEffect(() => {
    setShowTooltip(false);
    if (!repoUrl) {
      setUrlExists(null);
      setIsCheckingUrl(false);
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+(\/.*)?$/;
    if (!githubRegex.test(repoUrl)) {
      setUrlExists(null);
      setIsCheckingUrl(false);
      return;
    }

    setIsCheckingUrl(true);
    const timer = setTimeout(() => {
      const cleanUrl = repoUrl.toLowerCase().replace(/\/$/, '');
      const exists = existingUrls.includes(cleanUrl);
      setUrlExists(exists);
      setIsCheckingUrl(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [repoUrl, existingUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl) {
      toast.error("Repository URL is required.");
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+(\/.*)?$/;
    if (!githubRegex.test(repoUrl)) {
      toast.error("Invalid GitHub URL format");
      return;
    }

    if (urlExists === true) {
      toast.error("This repo is already listed.");
      return;
    }
    
    if (!addedByName) {
      toast.error("Name (Added by) is required.");
      return;
    }

    if (addedByUrl) {
      const urlRegex = /^https?:\/\/.+$/;
      if (!urlRegex.test(addedByUrl)) {
        toast.error("Invalid Link URL");
        return;
      }
    }

    if (!turnstileToken) {
      toast.error("Please verify that you are a human.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitGithubRepo(repoUrl, addedByName, addedByUrl, turnstileToken);
      toast.success("Repository submitted successfully.");
      
      setRepoUrl("");
      setAddedByName("");
      setAddedByUrl("");
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <BackButton fallbackUrl="/activity" label="Back to Activity" />

        <div className="mt-8 mb-12 flex flex-col items-start text-left space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
            /add-repository
          </h1>
          <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
            After submitting, please wait for review and approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 w-full">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-fill-color">Repository URL <span className="text-red-500">*</span></label>
              {isCheckingUrl && <Spinner className="w-3.5 h-3.5 text-blue-500" />}
              {!isCheckingUrl && urlExists !== null && (
                <div ref={tooltipRef} className="flex items-center gap-1.5 relative">
                  {urlExists ? (
                    <LiaTimesCircleSolid className="w-[17px] h-[17px] text-red-500" />
                  ) : (
                    <FaRegCircleCheck className="w-3.5 h-3.5 text-green-500" />
                  )}
                  <button 
                    type="button" 
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="text-fill-color/50 hover:text-fill-color cursor-pointer transition-colors outline-none"
                  >
                    <AiOutlineExclamationCircle className="w-4 h-4" />
                  </button>
                  
                  {showTooltip && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-max bg-[var(--card-color)] border border-[var(--border-divider)] px-3 py-2 rounded-lg shadow-lg z-10 text-xs font-medium animate-in fade-in zoom-in duration-200">
                      {urlExists ? "This repo is already listed." : "This repo is not listed yet."}
                    </div>
                  )}
                </div>
              )}
            </div>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-fill-color">Name (addedby) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={addedByName}
              onChange={(e) => setAddedByName(e.target.value)}
              placeholder="Your name or username"
              className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-fill-color">Link <span className="text-fill-color/40 font-normal">(opsional)</span></label>
            <input
              type="url"
              value={addedByUrl}
              onChange={(e) => setAddedByUrl(e.target.value)}
              placeholder="Your website, portfolio, or social link"
              className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
            />
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
              {isSubmitting ? <Spinner className="w-5 h-5 text-white" /> : "Add Repo"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}