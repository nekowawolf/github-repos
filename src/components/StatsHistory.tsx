'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GithubRepo, RepoHistoryData } from '@/types/githubRepo';
import { Spinner } from '@/components/ui/spinner';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import Pagination2 from '@/components/Pagination2';

const ITEMS_PER_PAGE = 5;

const PERIODS = [
  { value: 'today', label: '24 Hours' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
];

const STATS_TYPES = [
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
];

const SORT_BY_OPTIONS = [
  { value: 'total', label: 'Sort by Total' },
  { value: 'growth', label: 'Sort by Growth' },
];

export default function StatsHistory() {
  const router = useRouter();
  
  const [allRepos, setAllRepos] = useState<GithubRepo[]>([]);
  const historyCache = useRef<Record<string, Record<string, RepoHistoryData | null>>>({
    today: {},
    week: {},
    month: {}
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState<'today'|'week'|'month'>('today');
  const [statsType, setStatsType] = useState<'stars'|'forks'>('stars');
  const [sortBy, setSortBy] = useState<'total'|'growth'>('total');
  const [sortOrder, setSortOrder] = useState<'desc'|'asc'>('desc');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftPeriod, setDraftPeriod] = useState(period);
  const [draftStatsType, setDraftStatsType] = useState(statsType);
  const [draftSortBy, setDraftSortBy] = useState(sortBy);
  const [draftSortOrder, setDraftSortOrder] = useState(sortOrder);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
          if (filterRef.current && !filterRef.current.contains(event.target as Node)) setIsFilterOpen(false);
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenFilters = () => {
      setDraftPeriod(period);
      setDraftStatsType(statsType);
      setDraftSortBy(sortBy);
      setDraftSortOrder(sortOrder);
      setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
      setPeriod(draftPeriod);
      setStatsType(draftStatsType);
      setSortBy(draftSortBy);
      setSortOrder(draftSortOrder);
      setCurrentPage(1);
      setIsFilterOpen(false);
  };

  const [displayData, setDisplayData] = useState<{repo: GithubRepo, history: RepoHistoryData | null}[]>([]);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      try {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo`;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);
        setAllRepos(data);
      } catch (error) {
        console.error("Failed to load repos for history:", error);
      }
    };
    initFetch();
  }, []);

  useEffect(() => {
    if (allRepos.length === 0) return;

    const loadHistoryAndSort = async () => {
      setLoading(true);
      
      const currentCache = historyCache.current[period];
      
      const reposToFetch = allRepos.filter(r => currentCache[r._id] === undefined);

      if (reposToFetch.length > 0) {
        await Promise.all(
          reposToFetch.map(async (repo) => {
            try {
              const historyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo/${repo._id}/history?period=${period}`;
              const res = await fetch(historyUrl);
              if (res.ok) {
                const data = await res.json();
                currentCache[repo._id] = data.data;
              } else {
                currentCache[repo._id] = null;
              }
            } catch (err) {
              currentCache[repo._id] = null;
            }
          })
        );
      }

      const combined = allRepos.map(repo => ({
        repo,
        history: currentCache[repo._id] || null
      }));

      combined.sort((a, b) => {
        const getMetric = (item: typeof combined[0]) => {
          if (sortBy === 'total') {
            const val = statsType === 'stars' ? item.repo.stats?.stars : item.repo.stats?.forks;
            return val || 0;
          } else {
            if (!item.history || !item.history.available || !item.history.growth) return -9999999;
            return statsType === 'stars' ? item.history.growth.stars : item.history.growth.forks;
          }
        };

        const valA = getMetric(a);
        const valB = getMetric(b);

        if (sortOrder === 'desc') {
          return valB - valA;
        } else {
          return valA - valB;
        }
      });

      setDisplayData(combined);
      setLoading(false);
    };

    loadHistoryAndSort();
  }, [allRepos, period, statsType, sortBy, sortOrder]);


  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = displayData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasActiveFilter = period !== 'today' || statsType !== 'stars' || sortBy !== 'total' || sortOrder !== 'desc';

  return (
    <>
      <div className="w-full mt-16 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold tracking-tight text-fill-color">/repository-stats</h2>
          <p className="text-sm text-fill-color/60">Repository statistics and growth over the selected period.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Inlined Filters Menu */}
          <div className="relative inline-block text-left shrink-0" ref={filterRef}>
              <button
                  onClick={() => isFilterOpen ? setIsFilterOpen(false) : handleOpenFilters()}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm
                      ${isFilterOpen || hasActiveFilter ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-[rgba(var(--fill-color-rgb),0.05)] text-fill-color/80 border border-[var(--border-divider)] hover:text-fill-color hover:border-blue-500/50'}`}
              >
                  <FiFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Filters</span>
              </button>

              {isFilterOpen && (
                  <div className="absolute z-50 mt-3 w-72 rounded-2xl bg-[var(--card-color)] border border-[var(--border-divider)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 left-0 sm:left-auto sm:right-0 origin-top-left sm:origin-top-right">
                      <div className="p-4 flex flex-col space-y-5">
                          
                          {/* Metric */}
                          <div className="flex flex-col space-y-2">
                            <span className="text-xs font-bold text-fill-color/50 uppercase tracking-wider ml-1">Statistic</span>
                            <div className="flex bg-[rgba(var(--fill-color-rgb),0.03)] p-1 rounded-lg border border-[var(--border-divider)]">
                               {STATS_TYPES.map(s => (
                                 <button
                                   key={s.value}
                                   onClick={() => setDraftStatsType(s.value as any)}
                                   className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-semibold rounded-md ${draftStatsType === s.value ? 'bg-blue-600/20 text-blue-500 shadow-sm border border-blue-500/30' : 'text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] cursor-pointer'}`}
                                 >
                                   {s.value === 'stars' ? <FaStar className="w-3 h-3" /> : <FaCodeBranch className="w-3 h-3" />}
                                   {s.label}
                                 </button>
                               ))}
                            </div>
                          </div>

                          {/* Period */}
                          <div className="flex flex-col space-y-2">
                            <span className="text-xs font-bold text-fill-color/50 uppercase tracking-wider ml-1">Period</span>
                            <div className="flex bg-[rgba(var(--fill-color-rgb),0.03)] p-1 rounded-lg border border-[var(--border-divider)]">
                               {PERIODS.map(p => (
                                 <button
                                   key={p.value}
                                   onClick={() => setDraftPeriod(p.value as any)}
                                   className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${draftPeriod === p.value ? 'bg-blue-600/20 text-blue-500 shadow-sm border border-blue-500/30' : 'text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] cursor-pointer'}`}
                                 >
                                   {p.label}
                                 </button>
                               ))}
                            </div>
                          </div>

                          {/* Sort By */}
                          <div className="flex flex-col space-y-2">
                            <span className="text-xs font-bold text-fill-color/50 uppercase tracking-wider ml-1">Sort By</span>
                            <div className="flex bg-[rgba(var(--fill-color-rgb),0.03)] p-1 rounded-lg border border-[var(--border-divider)]">
                               {SORT_BY_OPTIONS.map(s => (
                                 <button
                                   key={s.value}
                                   onClick={() => setDraftSortBy(s.value as any)}
                                   className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${draftSortBy === s.value ? 'bg-blue-600/20 text-blue-500 shadow-sm border border-blue-500/30' : 'text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] cursor-pointer'}`}
                                 >
                                   {s.label.replace('Sort by ', '')}
                                 </button>
                               ))}
                            </div>
                          </div>

                          {/* Sort Order */}
                          <div className="flex flex-col space-y-2">
                            <span className="text-xs font-bold text-fill-color/50 uppercase tracking-wider ml-1">Order</span>
                            <div className="flex bg-[rgba(var(--fill-color-rgb),0.03)] p-1 rounded-lg border border-[var(--border-divider)]">
                               <button
                                 onClick={() => setDraftSortOrder('desc')}
                                 className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-semibold rounded-md ${draftSortOrder === 'desc' ? 'bg-blue-600/20 text-blue-500 shadow-sm border border-blue-500/30' : 'text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] cursor-pointer'}`}
                               >
                                 <HiSortDescending className="w-4 h-4" /> Highest
                               </button>
                               <button
                                 onClick={() => setDraftSortOrder('asc')}
                                 className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-semibold rounded-md ${draftSortOrder === 'asc' ? 'bg-blue-600/20 text-blue-500 shadow-sm border border-blue-500/30' : 'text-fill-color/70 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] cursor-pointer'}`}
                               >
                                 <HiSortAscending className="w-4 h-4" /> Lowest
                               </button>
                            </div>
                          </div>

                          {/* Apply Button */}
                          <div className="pt-2 border-t border-[var(--border-divider)]">
                             <button
                               onClick={handleApplyFilters}
                               className="w-full flex justify-center items-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                             >
                               Apply Filters
                             </button>
                          </div>

                      </div>
                  </div>
              )}
          </div>
        </div>
      </div>

      {loading && paginatedData.length === 0 ? (
        <div className="flex justify-center items-center py-20 w-full">
          <Spinner className="text-blue-500 size-10" />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {paginatedData.length > 0 ? (
            <div className="flex flex-col space-y-4 w-full">
              {paginatedData.map(({repo, history}) => {
                const isAvailable = history?.available;
                let growthVal = 0;
                let totalVal = 0;
                
                if (isAvailable && history.growth && history.current) {
                  growthVal = statsType === 'stars' ? history.growth.stars : history.growth.forks;
                  totalVal = statsType === 'stars' ? history.current.stars : history.current.forks;
                } else if (repo.stats) {
                  totalVal = statsType === 'stars' ? repo.stats.stars : repo.stats.forks;
                }

                return (
                  <div
                    key={repo._id}
                    onClick={() => {
                      if (window.innerWidth >= 640) {
                        router.push(`/directory/${repo._id}`);
                      }
                    }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[rgba(var(--fill-color-rgb),0.02)] border border-[var(--border-divider)] hover:border-blue-500/30 transition-all duration-300 sm:cursor-pointer cursor-default w-full relative"
                  >
                    <div 
                      onClick={(e) => {
                        if (window.innerWidth < 640) {
                          router.push(`/directory/${repo._id}`);
                        }
                      }}
                      className="flex items-center gap-4 shrink-0 cursor-pointer w-full sm:w-auto"
                    >
                      {repo.stats?.image_url ? (
                        <img
                          src={repo.stats.image_url}
                          alt={repo.owner}
                          className="w-10 h-10 rounded-full object-cover border border-[var(--border-divider)] shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          <FaGithub className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className="flex flex-col min-w-0 flex-1 sm:w-[220px]">
                        <span className="text-base font-bold text-fill-color group-hover:text-blue-500 transition-colors duration-300 truncate">
                          {repo.name}
                        </span>
                        <span className="text-xs text-fill-color/50 font-mono truncate">
                          {repo.owner}/{repo.repo_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 mt-4 sm:mt-0 w-full sm:w-auto border-t border-[var(--border-divider)] sm:border-t-0 pt-3 sm:pt-0">
                      {/* Current Total */}
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-fill-color/50 uppercase tracking-wider font-semibold mb-1">
                          Total {statsType}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-sm">
                          {statsType === 'stars' ? <FaStar className="w-3.5 h-3.5 text-yellow-500" /> : <FaCodeBranch className="w-3.5 h-3.5 text-blue-500" />}
                          <span className="font-semibold">{totalVal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Growth */}
                      <div className="flex flex-col items-end min-w-[100px]">
                        <span className="text-xs text-fill-color/50 uppercase tracking-wider font-semibold mb-1">
                          Growth
                        </span>
                        {!isAvailable ? (
                          <span className="text-xs text-fill-color/40 italic font-mono bg-[rgba(var(--fill-color-rgb),0.05)] px-2 py-0.5 rounded-md">
                            No history
                          </span>
                        ) : (
                          <div className={`flex items-center font-mono font-bold text-sm ${growthVal > 0 ? 'text-green-500' : growthVal < 0 ? 'text-red-500' : 'text-fill-color/50'}`}>
                            {growthVal > 0 ? '+' : ''}{growthVal.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {loading && (
                      <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                         <Spinner className="text-blue-500 size-4 opacity-50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
              No repositories found.
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
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
    </>
  );
}