'use client';

import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Pagination2Props {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination2({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: Pagination2Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0) return null;

  const getPaginationRange = (): (number | '...')[] => {
    const delta = 1;
    const range: (number | '...')[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    let prev: number | undefined;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (prev !== undefined && i - prev > 1) {
          range.push('...');
        }
        range.push(i);
        prev = i;
      }
    }
    return range;
  };

  return (
    <Pagination className="flex justify-center mt-4">
      <PaginationContent className="flex flex-wrap justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              "cursor-pointer",
              "px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm",
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {getPaginationRange().map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis className="text-xs sm:text-base" />
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(Number(page))}
                className={cn(
                  "cursor-pointer",
                  "px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm transition-none",
                  currentPage === page
                    ? "text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-sm hover:bg-blue-500/30 hover:text-blue-400"
                    : "text-fill-color/60 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color"
                )}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              "cursor-pointer",
              "px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm",
              currentPage === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}