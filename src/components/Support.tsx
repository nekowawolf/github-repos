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
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative transition-transform duration-300 sm:hover:translate-x-2 w-full"
                  >
                    <div className="flex items-center gap-3 shrink-0 w-fit">
                      <div className="flex flex-col min-w-0">
                        {supporter.url ? (
                          <a 
                            href={supporter.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer font-semibold opacity-70 hover:opacity-100 transition-all text-fill-color text-base truncate max-w-[200px] sm:max-w-[300px]"
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

                    <div className="flex items-center justify-start sm:justify-end shrink-0 min-w-0 mt-1 sm:mt-0">
                      <div className="flex items-center gap-1.5 text-xs text-fill-color/60 font-mono mr-1.5">
                        {supporter.platform === 'Ko-fi' ? <SiKofi className="text-[#FF5E5B]" /> : <BiLogoBitcoin className="text-[#F7931A]" />}
                        {supporter.platform}
                        {supporter.created_at && (
                          <span className="text-fill-color/30 hidden sm:inline ml-1.5">·</span>
                        )}
                      </div>

                      <div className="relative flex items-center shrink-0 h-6 w-[90px]">
                        <div className="flex items-center text-xs text-fill-color/60 font-mono">
                          {supporter.created_at ? new Date(supporter.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : ''}
                        </div>
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