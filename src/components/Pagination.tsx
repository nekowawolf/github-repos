'use client';

import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl border border-color transition-all duration-200 ${
                    currentPage === 1
                        ? 'opacity-50 cursor-not-allowed bg-card-color/50 text-fill-color/30'
                        : 'hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-card-color text-fill-color/70'
                }`}
                aria-label="Previous page"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`w-10 h-10 rounded-xl font-medium border transition-all duration-200 ${
                            currentPage === 1
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                : 'hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-card-color border-color text-fill-color/70'
                        }`}
                    >
                        1
                    </button>
                    {startPage > 2 && (
                        <span className="text-fill-color/30 px-1">...</span>
                    )}
                </>
            )}

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 rounded-xl font-medium border transition-all duration-200 ${
                        currentPage === number
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                            : 'hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-card-color border-color text-fill-color/70'
                    }`}
                >
                    {number}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="text-fill-color/30 px-1">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`w-10 h-10 rounded-xl font-medium border transition-all duration-200 ${
                            currentPage === totalPages
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                : 'hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-card-color border-color text-fill-color/70'
                        }`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl border border-color transition-all duration-200 ${
                    currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed bg-card-color/50 text-fill-color/30'
                        : 'hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-card-color text-fill-color/70'
                }`}
                aria-label="Next page"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}