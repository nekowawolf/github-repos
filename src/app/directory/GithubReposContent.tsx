'use client';

import NwwOneeAIChat from "@/components/NwwOneeAIChat";
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { Spinner } from '@/components/ui/spinner';
import { FallbackImage } from '@/components/FallbackImage';
import { Suspense, useRef, useState, useEffect } from 'react';
import { FaCode, FaServer, FaDatabase, FaShieldAlt, FaGraduationCap, FaGithub, FaRegFileImage, FaFileAlt } from 'react-icons/fa';
import { LuAudioLines } from "react-icons/lu";
import { GoCpu } from "react-icons/go";
import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDesignServices, MdOutlineOndemandVideo } from "react-icons/md";
import { CgClose } from "react-icons/cg";

const ITEMS_PER_PAGE = 8;

const categories = [
    "Automation",
    "Development",
    "All",
    "AI",
    "Infrastructure",
    "Data",
    "Design",
    "Image",
    "Video",
    "Audio",
    "Security",
    "Document",
    "Learning"
];

const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'automation': return <RiRobot2Line className="w-8 h-8" />;
        case 'ai': return <GoCpu className="w-8 h-8" />;
        case 'development': return <FaCode className="w-8 h-8" />;
        case 'infrastructure': return <FaServer className="w-8 h-8" />;
        case 'data': return <FaDatabase className="w-8 h-8" />;
        case 'security': return <FaShieldAlt className="w-8 h-8" />;
        case 'learning': return <FaGraduationCap className="w-8 h-8" />;
        case 'design': return <MdOutlineDesignServices className="w-8 h-8" />;
        case 'image': return <FaRegFileImage className="w-8 h-8" />;
        case 'video': return <MdOutlineOndemandVideo className="w-8 h-8" />;
        case 'audio': return <LuAudioLines className="w-8 h-8" />;
        case 'document': return <FaFileAlt className="w-8 h-8" />;
        default: return <FaGithub className="w-8 h-8" />;
    }
};

const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

export default function GithubReposContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner className="text-blue-500 size-10" />
            </div>
        }>
            <GithubReposContentInner />
        </Suspense>
    );
}

function GithubReposContentInner() {
    const {
        displayedRepos,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        handleClearSearch,
        activeCategory,
        handleCategoryChange,
        currentPage,
        handlePageChange,
        totalPages,
        totalItems
    } = useGithubRepos(ITEMS_PER_PAGE);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current && fadeRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
                const hasMore = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;
                fadeRef.current.style.opacity = hasMore ? '1' : '0';
                fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
            }
        };

        const timeoutId = setTimeout(checkOverflow, 50);
        
        window.addEventListener('resize', checkOverflow);
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkOverflow);
        }
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkOverflow);
            }
        };
    }, [categories.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center px-4">
                    <h1 className="text-3xl font-bold mb-2">
                        GitHub Repositories
                    </h1>
                    <p className="text-fill-color/70 w-full sm:max-w-md mx-auto">
                        Explore a curated directory of GitHub repositories to find useful tools and projects across every category.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl mb-6 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-fill-color/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Repositories"
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        className="w-full py-3 pl-12 pr-12 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                    />
                    {localSearchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                            aria-label="Clear search"
                        >
                            <CgClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="relative w-full md:max-w-3xl mb-10 mx-auto overflow-hidden">
                    <div 
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex overflow-x-auto gap-2 items-center md:pb-3 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 cursor-pointer ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white border border-transparent'
                                        : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* Fade indicator */}
                    <div 
                        ref={fadeRef}
                        className="absolute right-0 top-0 h-8 w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-200" 
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {error && (
                            <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-7xl mb-4">
                                Error loading repositories: {error}
                            </div>
                        )}

                        {/* Repos Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
                            {displayedRepos.length > 0 ? (
                                displayedRepos.map((repo) => (
                                    <Link
                                        href={`/directory/${repo._id}`}
                                        key={repo._id}
                                        className="relative group rounded-2xl p-[1px] overflow-hidden block hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative glass-card rounded-2xl p-6 flex flex-col h-full bg-card-color/80 backdrop-blur-xl border border-[var(--border-divider)]">

                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {repo.stats?.image_url ? (
                                                        <img
                                                            src={repo.stats.image_url}
                                                            alt={repo.owner}
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 rounded-full object-cover border border-[var(--border-divider)]"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {getCategoryIcon(repo.category)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs text-fill-color/60 font-mono truncate" title={`@${repo.owner}`}>@{repo.owner}</span>
                                                        <h3 className="text-lg font-bold text-fill-color group-hover:text-blue-400 transition-colors line-clamp-1">
                                                            {repo.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap ml-2">
                                                    {repo.category}
                                                </span>
                                            </div>

                                            <p className="text-sm text-fill-color/60 line-clamp-3 mb-4 flex-grow">
                                                {repo.description}
                                            </p>

                                            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-divider)] text-fill-color/70 text-xs">
                                                {repo.stats ? (
                                                    <>
                                                        <div className="flex items-center gap-1.5" title={`${repo.stats.stars} stars`}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                            <span>{formatNumber(repo.stats.stars)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5" title={`${repo.stats.forks} forks`}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
                                                            <span>{formatNumber(repo.stats.forks)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5" title={repo.stats.language}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                                            <span className="line-clamp-1 max-w-[80px]">{repo.stats.language || 'N/A'}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-fill-color/40 italic">No stats available</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-1">
                                        <FallbackImage
                                            src="https://nekowawolf.github.io/cdn-images/images/2026/1784476217_nwwonee_search.webp"
                                            alt="No data found"
                                            width={160}
                                            height={160}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 -mt-4">No data available.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {displayedRepos.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}
            </div>
            <NwwOneeAIChat />
        </div>
    );
}