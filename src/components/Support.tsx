'use client';

import { useState, useEffect } from "react";
import { fetchSupportersData } from "@/services/supporterService";
import { Spinner } from "@/components/ui/spinner";
import Pagination2 from '@/components/Pagination2';
import { Supporter } from '@/types/supporter';
import { SiKofi } from 'react-icons/si';
import { BiLogoBitcoin } from 'react-icons/bi';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

export default function Support() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSupportersData();

        const sortedData = [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        setSupporters(sortedData);
      } catch (error) {
        console.error("Failed to load supporters:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalItems = supporters.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const displayedSupporters = supporters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const proofUrl = (value?: string) => {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch {
      return null;
    }
  };

  return (
    <>
      <div className="w-full mt-24 mb-12 flex flex-col items-start text-left space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
          /support-us
        </h1>
        <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
          Support <a href="https://www.nekowawolf.xyz/ecosystem" target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color font-semibold">nww ecosystem</a> and help us keep building.{" "}
          <Link
            href="/support-us"
            className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
          >
            Support Us
          </Link>
        </p>
      </div>

      {/* Public Supporters List */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10 w-full">
            <Spinner className="text-blue-500 size-10" />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {displayedSupporters.length > 0 ? (
              <div className="flex flex-col space-y-8 sm:space-y-10 w-full">
                {displayedSupporters.map((supporter) => (
                  <div
                    key={supporter._id}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative transition-transform duration-300 sm:hover:translate-x-2 w-full ${proofUrl(supporter.proof) ? 'cursor-pointer' : ''}`}
                  >
                    {proofUrl(supporter.proof) && (
                      <a href={proofUrl(supporter.proof)!} target="_blank" rel="noopener noreferrer" aria-label={`View details for ${supporter.name}`} className="absolute inset-0 z-10" />
                    )}
                    <div className="flex items-center gap-3 shrink-0 w-fit pointer-events-none">
                      <div className="flex flex-col min-w-0">
                        {supporter.url ? (
                          <a 
                            href={supporter.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="relative z-20 pointer-events-auto cursor-pointer font-semibold opacity-70 hover:opacity-100 transition-all text-fill-color text-base truncate max-w-[200px] sm:max-w-[300px]"
                          >
                            {supporter.name}
                          </a>
                        ) : (
                          <span className="font-semibold text-fill-color text-base truncate max-w-[200px] sm:max-w-[300px]">
                            {supporter.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="hidden sm:block flex-1 h-[1px] bg-[var(--border-divider)] group-hover:bg-blue-500/30 transition-colors duration-300 mx-4" />

                    <div className="flex items-center justify-start sm:justify-end shrink-0 min-w-0 mt-1 sm:mt-0 pointer-events-none">
                      <div className="flex items-center gap-1.5 text-xs text-fill-color/60 font-mono mr-1.5">
                        {supporter.platform === 'Ko-fi' ? <SiKofi className="text-[#FF5E5B]" /> : <BiLogoBitcoin className="text-[#F7931A]" />}
                        {supporter.platform}
                        {supporter.created_at && (
                          <span className="text-fill-color/30 hidden sm:inline ml-1.5">·</span>
                        )}
                      </div>

                      <div className="relative flex items-center shrink-0 h-6 overflow-hidden w-[105px]">
                        <div className={`absolute inset-y-0 left-0 flex items-center text-xs text-fill-color/60 font-mono transition-all duration-300 ${proofUrl(supporter.proof) ? 'group-hover:opacity-0 group-hover:-translate-y-full' : ''}`}>
                          {supporter.created_at ? new Date(supporter.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : ''}
                        </div>
                        {proofUrl(supporter.proof) && (
                          <div className="absolute inset-y-0 left-0 flex items-center text-xs text-blue-500 font-mono transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                            View Details →
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination2
                      currentPage={currentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={totalItems}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
                No data found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}