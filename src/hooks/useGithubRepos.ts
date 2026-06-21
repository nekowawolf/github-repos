import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { GithubRepo } from '@/types/githubRepo';
import { fetchGithubReposData } from '@/services/githubRepoService';

export function useGithubRepos(itemsPerPage: number) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [allRepos, setAllRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const activeCategory = searchParams.get('category') || 'All';
    const currentPage = Number(searchParams.get('page')) || 1;

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

    // Debounce search URL update
    useEffect(() => {
        const handler = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (localSearchQuery !== currentQ) {
                const params = new URLSearchParams(searchParams.toString());
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, router, searchParams]);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newCategory !== 'All') params.set('category', newCategory);
        else params.delete('category');
        
        if (newPage > 1) params.set('page', newPage.toString());
        else params.delete('page');
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

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
    };

    const handleCategoryChange = (category: string) => {
        updateURL(category, localSearchQuery, 1);
    };

    const handlePageChange = (page: number) => {
        updateURL(activeCategory, localSearchQuery, page);
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