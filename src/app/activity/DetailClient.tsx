'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";
import Pagination2 from "@/components/Pagination2";

import { GithubRepo } from "@/types/githubRepo";
import { Spinner } from "@/components/ui/spinner";
import { FaGithub } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

export default function DetailClient() {
  const router = useRouter();
  const [activities, setActivities] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    loadData();
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
                    onClick={() => router.push(`/directory/${repo._id}`)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative transition-transform duration-300 hover:translate-x-2 cursor-pointer w-full"
                  >
                    <div className="flex items-center gap-3 shrink-0">
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

      </div>
      <NwwOneeAIChat />
    </main>
  );
}