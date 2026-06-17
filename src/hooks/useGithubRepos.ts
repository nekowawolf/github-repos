import { useState, useEffect, useMemo } from 'react';
import { GithubRepo } from '@/types/githubRepo';
import { fetchGithubReposData } from '@/services/githubRepoService';

export function useGithubRepos(itemsPerPage: number) {
    const [allRepos, setAllRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadRepos = async () => {
            setLoading(true);
            try {
                const data = await fetchGithubReposData();
                setAllRepos(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load github repos");
            } finally {
                setLoading(false);
            }
        };

        loadRepos();
    }, []);

    const filteredRepos = useMemo(() => {
        return allRepos.filter(repo => {
            const matchesCategory = activeCategory === "All" ||
                repo.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = repo.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                repo.description.toLowerCase().includes(localSearchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allRepos, activeCategory, localSearchQuery]);

    const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedRepos = filteredRepos.slice(startIndex, endIndex);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
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
        totalItems: filteredRepos.length
    };
}