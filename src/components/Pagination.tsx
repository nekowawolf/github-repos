'use client';

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col items-center mt-12 mb-12 gap-4">
            <span className="text-sm text-fill-color/70">
                Showing <span className="font-semibold text-fill-color">{start}</span> to{' '}
                <span className="font-semibold text-fill-color">{end}</span> of{' '}
                <span className="font-semibold text-fill-color">{totalItems}</span> Entries
            </span>

            <div className="inline-flex mt-2 xs:mt-0 gap-2">
                <button
                    className="flex items-center justify-center px-4 h-10 text-sm font-medium text-fill-color bg-card-color border border-color rounded-lg hover:bg-card-color/80 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Prev
                </button>
                <button
                    className="flex items-center justify-center px-4 h-10 text-sm font-medium text-fill-color bg-card-color border border-color rounded-lg hover:bg-card-color/80 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}