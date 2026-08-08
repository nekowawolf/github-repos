'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";
import Pagination2 from "@/components/Pagination2";
import { fetchGithubCommits } from "@/services/githubRepoService";
import { GithubRepo } from "@/types/githubRepo";
import { Spinner } from "@/components/ui/spinner";
import { FaGithub, FaCheck, FaCode, FaExternalLinkAlt } from "react-icons/fa";
import { FaCodeCommit } from "react-icons/fa6";

const ITEMS_PER_PAGE = 5;

export default function DetailClient() {
  const router = useRouter();
  const [activities, setActivities] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [commits, setCommits] = useState<any[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(true);
  const [showMoreCommits, setShowMoreCommits] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo`;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const rawData = await response.json();
        
        const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);
        
        const sortedData = [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        setActivities(sortedData);
      } catch (error) {
        console.error("Failed to load activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    const loadCommits = async () => {
      try {
        const data = await fetchGithubCommits('nekowawolf', 'github-repos', 8);
        setCommits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load commits:", error);
      } finally {
        setCommitsLoading(false);
      }
    };

    loadData();
    loadCommits();
  }, []);

  const totalItems = activities.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const displayedActivities = activities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <main className="flex-grow pt-36 pb-16 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col">

        {/* Header Text */}
        <div className="w-full mb-12 flex flex-col items-start text-left space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
            /last-added-repos
          </h1>

          <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
            Latest repositories added to the ecosystem directory by contributors.{" "}
            <button
              onClick={() => {
                chatStore.setIsOpen(true);
                chatStore.setActiveView("user");
              }}
              className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
            >
              Add Repository
            </button>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 w-full">
            <Spinner className="text-blue-500 size-10" />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {displayedActivities.length > 0 ? (
              <div className="flex flex-col space-y-8 sm:space-y-10 w-full">
                {displayedActivities.map((repo) => (
                  <div
                    key={repo._id}
                    onClick={() => {
                      if (window.innerWidth >= 640) {
                        router.push(`/directory/${repo._id}`);
                      }
                    }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative transition-transform duration-300 sm:hover:translate-x-2 sm:cursor-pointer cursor-default w-full"
                  >
                    <div 
                      onClick={(e) => {
                        if (window.innerWidth < 640) {
                          router.push(`/directory/${repo._id}`);
                        }
                      }}
                      className="flex items-center gap-3 shrink-0 cursor-pointer w-fit"
                    >
                      {repo.stats?.image_url ? (
                        <img
                          src={repo.stats.image_url}
                          alt={repo.owner}
                          className="w-7 h-7 rounded-full object-cover border border-[var(--border-divider)] shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          <FaGithub className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-lg sm:text-xl font-bold text-fill-color group-hover:text-blue-500 transition-colors duration-300 tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
                        {repo.name}
                      </span>
                    </div>

                    <span className="hidden sm:block flex-1 h-[1px] bg-[var(--border-divider)] group-hover:bg-blue-500/30 transition-colors duration-300 mx-4" />
                    <div className="flex items-center justify-start sm:justify-end shrink-0 min-w-0 mt-1 sm:mt-0">
                      {repo.added_by?.name && (
                        <div className="flex items-center gap-1.5 text-xs text-fill-color/60 font-mono mr-1.5">
                          <span>added by</span>
                          {repo.added_by.url ? (
                            <a
                              href={repo.added_by.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="cursor-pointer font-semibold opacity-70 hover:opacity-100 transition-all text-fill-color"
                            >
                              {repo.added_by.name}
                            </a>
                          ) : (
                            <span className="font-semibold text-fill-color">{repo.added_by.name}</span>
                          )}
                          {repo.created_at && (
                            <span className="text-fill-color/30 hidden sm:inline">·</span>
                          )}
                        </div>
                      )}

                      {/* Rolling Section */}
                      <div className="relative flex items-center shrink-0 h-6 overflow-hidden w-[105px]">
                        <div className="absolute inset-y-0 left-0 flex items-center text-xs text-fill-color/60 font-mono transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-full">
                          {repo.created_at && (
                            <span>
                              {new Date(repo.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>

                        {/* Hover View */}
                        <div className="absolute inset-y-0 left-0 flex items-center text-xs text-blue-500 font-mono transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                          <span>View Details →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
                No activity found.
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination2
                  currentPage={currentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

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
            <div className="relative pl-6 border-l-[2px] border-[var(--border-divider)] border-opacity-50 ml-4 space-y-8">
              {Object.entries(groupedDisplayedCommits).map(([date, dateCommits]) => (
                <div key={date} className="relative">
                  <div className="flex items-center gap-2 -ml-9 mb-2">
                    <div className="w-6 h-6 rounded-full body-color border border-[var(--border-divider)] flex items-center justify-center relative z-10 text-fill-color/50 shadow-sm">
                      <FaCodeCommit className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-fill-color/60 body-color relative z-10 px-1">Commits on {date}</span>
                  </div>

                  <div className="border border-[var(--border-divider)] rounded-xl overflow-hidden bg-[rgba(var(--fill-color-rgb),0.02)]">
                    {(dateCommits as any[]).map((commit: any, idx: number) => (
                      <div key={commit.sha} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${idx !== (dateCommits as any[]).length - 1 ? 'border-b border-[var(--border-divider)]' : ''}`}>
                        <div className="flex flex-col gap-1.5">
                          <a href={commit.html_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-fill-color hover:text-blue-500 transition-colors line-clamp-1">
                            {commit.commit.message.split('\n')[0]}
                          </a>
                          <div className="flex items-center gap-2 text-xs text-fill-color/70">
                            {commit.author?.avatar_url && (
                              <img src={commit.author.avatar_url} alt={commit.commit.author.name} className="w-5 h-5 rounded-full object-cover" />
                            )}
                            <span className="font-semibold text-fill-color">{commit.commit.author?.login || commit.commit.author.name}</span>
                            <span>committed</span>
                            <span>{new Date(commit.commit.author.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            <span className="text-green-500 ml-1" title="Verified"><FaCheck className="w-3 h-3" /></span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center mt-2 sm:mt-0 gap-2">
                          <div className="flex items-center font-mono text-xs border border-[var(--border-divider)] rounded-md overflow-hidden bg-transparent">
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

      </div>
      <NwwOneeAIChat />
    </main>
  );
}