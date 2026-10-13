'use client';

import { useState, useEffect, useRef } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { FaCheck, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import { FaCodeCommit } from 'react-icons/fa6';
import { RxDotsHorizontal } from 'react-icons/rx';
import { PiDotsThreeFill } from 'react-icons/pi';

const CommitMobileDropdown = ({ commitUrl, treeUrl }: { commitUrl: string, treeUrl: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative sm:hidden" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] rounded-md transition-colors cursor-pointer flex items-center justify-center"
      >
        <RxDotsHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-max min-w-[210px] rounded-xl bg-[var(--card-color)] border border-[var(--border-divider)] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 right-0 origin-top-right py-1">
          <a
            href={commitUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-fill-color/70 hover:bg-blue-500/10 hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            <FaCodeCommit className="w-4 h-4 shrink-0" />
            <span className="font-medium">View commit details</span>
          </a>
          <a
            href={treeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-fill-color/70 hover:bg-blue-500/10 hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            <FaCode className="w-4 h-4 shrink-0" />
            <span className="font-medium">Browse repository at this point</span>
          </a>
        </div>
      )}
    </div>
  );
};

const CommitMessage = ({ message, url }: { message: string, url: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const subject = message.split('\n')[0];
  const body = message.substring(subject.length).trim();
  const hasBody = body.length > 0;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-1">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`text-sm font-bold text-fill-color hover:text-blue-500 transition-colors ${!isExpanded ? 'line-clamp-1' : 'break-words'}`}
        >
          {subject}
        </a>
        {hasBody && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 flex items-center justify-center cursor-pointer text-fill-color opacity-70 hover:opacity-100 transition-all"
            title="Toggle commit body"
          >
            <PiDotsThreeFill className="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
          </button>
        )}
      </div>
      {hasBody && isExpanded && (
        <div className="mt-2 p-3 text-xs sm:text-sm text-fill-color/80 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-lg whitespace-pre-wrap break-words font-mono">
          {body}
        </div>
      )}
    </div>
  );
};

export default function LastCommits() {
  const [commits, setCommits] = useState<any[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(true);
  const [showMoreCommits, setShowMoreCommits] = useState(false);

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo/commits/nekowawolf/github-repos?per_page=8`;
        const res = await fetch(fullUrl);
        if (res.ok) {
          const result = await res.json();
          setCommits(Array.isArray(result.data) ? result.data : []);
        } else {
          setCommits([]);
        }
      } catch (error) {
        console.error("Failed to load commits:", error);
      } finally {
        setCommitsLoading(false);
      }
    };
    loadCommits();
  }, []);

  const displayedCommits = showMoreCommits ? commits : commits.slice(0, 4);
  const groupedDisplayedCommits = displayedCommits.reduce((acc, commit) => {
    if (!commit?.commit?.author?.date) return acc;
    const date = new Date(commit.commit.author.date).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(commit);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      {/* Last Commits Header */}
      <div className="w-full mt-24 mb-12 flex flex-col items-start text-left space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
          /last-commits
        </h1>
        <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
          Recent commits and contributions to the project.{" "}
          <a
            href="https://github.com/nekowawolf/github-repos"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
          >
            Contribute
          </a>
        </p>
      </div>

      {/* Commits List */}
      {commitsLoading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <Spinner className="text-blue-500 size-10" />
        </div>
      ) : (
        <div className="flex flex-col w-full relative">
          <div className="relative pl-3 sm:pl-6 border-l-[2px] border-[var(--border-divider)] border-opacity-50 ml-2 sm:ml-4 space-y-8">
            {Object.entries(groupedDisplayedCommits).map(([date, dateCommits]) => (
              <div key={date} className="relative">
                <div className="flex items-center gap-2 -ml-6 sm:-ml-9 mb-2">
                  <div className="w-6 h-6 rounded-full body-color border border-[var(--border-divider)] flex items-center justify-center relative z-10 text-fill-color/50 shadow-sm">
                    <FaCodeCommit className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-xs text-fill-color/60 body-color relative z-10 px-1">Commits on {date}</span>
                </div>

                <div className="border border-[var(--border-divider)] rounded-xl bg-[rgba(var(--fill-color-rgb),0.02)]">
                  {(dateCommits as any[]).map((commit: any, idx: number) => (
                    <div key={commit.sha} className={`flex flex-row items-start justify-between p-4 ${idx !== (dateCommits as any[]).length - 1 ? 'border-b border-[var(--border-divider)]' : ''}`}>
                      <div className="flex flex-col gap-2.5 flex-1 min-w-0 pr-2 sm:pr-4">
                        <CommitMessage message={commit.commit.message} url={commit.html_url} />
                        <div className="flex flex-wrap items-center gap-2 text-xs text-fill-color/70 mt-1">
                          {commit.author?.avatar_url && (
                            <img src={commit.author.avatar_url} alt={commit.commit.author.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                          )}
                          <span className="font-semibold text-fill-color truncate max-w-[100px] sm:max-w-none">{commit.commit.author?.login || commit.commit.author.name}</span>
                          <span className="shrink-0">committed</span>
                          <span className="shrink-0">{new Date(commit.commit.author.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          <span className="text-green-500 shrink-0" title="Verified"><FaCheck className="w-3 h-3" /></span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <CommitMobileDropdown
                          commitUrl={commit.html_url}
                          treeUrl={`https://github.com/nekowawolf/github-repos/tree/${commit.sha}`}
                        />
                        <div className="hidden sm:flex items-center font-mono text-xs border border-[var(--border-divider)] rounded-md overflow-hidden bg-transparent">
                          <a href={commit.html_url} target="_blank" rel="noreferrer" className="px-2 py-1 text-blue-500 hover:bg-[rgba(var(--fill-color-rgb),0.05)] transition-colors border-r border-[var(--border-divider)]">{commit.sha.substring(0, 7)}</a>
                          <a href={`https://github.com/nekowawolf/github-repos/tree/${commit.sha}`} target="_blank" rel="noreferrer" className="px-2 py-1 text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.05)] transition-colors" title="Browse the repository at this point in the history">
                            <FaCode className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {commits.length > 4 && (
            <div className="mt-8 flex flex-col items-center gap-3">
              {!showMoreCommits ? (
                <button
                  onClick={() => setShowMoreCommits(true)}
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors bg-[rgba(var(--fill-color-rgb),0.05)] px-4 py-2 rounded-lg cursor-pointer"
                >
                  See more commits
                </button>
              ) : (
                <>
                  <a
                    href="https://github.com/nekowawolf/github-repos/commits/main/"
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color bg-[rgba(var(--fill-color-rgb),0.05)] px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" /> View all commits on GitHub
                  </a>
                  <button
                    onClick={() => setShowMoreCommits(false)}
                    className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    See less
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}