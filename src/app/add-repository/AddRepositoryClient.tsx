'use client';

import { useState } from "react";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";

export default function AddRepositoryClient() {
  const [repoUrl, setRepoUrl] = useState("");
  const [addedByName, setAddedByName] = useState("");
  const [addedByUrl, setAddedByUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    toast.info("This feature is still in development.");
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
            <label className="text-sm font-semibold text-fill-color">Repository URL <span className="text-red-500">*</span></label>
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
              placeholder="https://yourwebsite.com or social link"
              className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl font-medium text-[15px] text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center w-fit cursor-pointer"
          >
            Add Repo
          </button>
        </form>
      </div>
    </main>
  );
}