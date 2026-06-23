'use client';

import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { Spinner } from '@/components/ui/spinner';
import { FallbackImage } from '@/components/FallbackImage';
import { Suspense } from 'react';
import { FaCode, FaServer, FaDatabase, FaShieldAlt, FaGraduationCap, FaGithub } from 'react-icons/fa';
import { GoCpu } from "react-icons/go";
import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDesignServices } from "react-icons/md";

const ITEMS_PER_PAGE = 8;

const categories = [
    "Automation",
    "Development",
    "All",
    "AI",
    "Infrastructure",
    "Data",
    "Design",
    "Security",
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
        default: return <FaGithub className="w-8 h-8" />;
    }
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
        activeCategory,
        handleCategoryChange,
        currentPage,
        handlePageChange,
        totalPages,
        totalItems
    } = useGithubRepos(ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        GitHub Repositories
                    </h1>
                    <p className="text-fill-color/70 max-w-md mx-auto">
                        Explore our curated collection of top GitHub repositories across various categories.
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
                        className="w-full py-3 pl-12 pr-6 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 ${activeCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'card-color text-fill-color/70 hover:text-fill-color border border-color'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
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
                                        className="relative group rounded-2xl p-[1px] overflow-hidden block hover:scale-[1.02] transition-transform duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative glass-card rounded-2xl p-6 flex flex-col h-full bg-card-color/80 backdrop-blur-xl border border-white/5">

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                                    {getCategoryIcon(repo.category)}
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {repo.category}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-fill-color mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                                                {repo.name}
                                            </h3>

                                            <p className="text-sm text-fill-color/60 line-clamp-3 mb-4 flex-grow">
                                                {repo.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <a 
                                                    href={`https://github.com/${repo.owner}`} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-xs font-mono opacity-70 hover:opacity-100 transition-opacity text-fill-color"
                                                >
                                                    @{repo.owner}
                                                </a>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-10">
                                        <FallbackImage
                                            src="https://nekowawolf.github.io/cdn-images/images/2026/1771661079_pixchan.png"
                                            alt="No data found"
                                            width={176}
                                            height={176}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 mt-4">No data available.</p>
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
        </div>
    );
}