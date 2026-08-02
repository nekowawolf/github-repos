import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { GithubRepo } from '@/types/githubRepo';


let isInitialLoad = true;

export function useGithubRepos(itemsPerPage: number) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [allRepos, setAllRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const [localCategory, setLocalCategory] = useState(searchParams.get('category') || 'All');
    const [localPage, setLocalPage] = useState(Number(searchParams.get('page')) || 1);

    useEffect(() => {
        const loadRepos = async () => {
            setLoading(true);
            try {
                let forceShuffle = false;
                if (isInitialLoad) {
                    isInitialLoad = false;
                    const urlParams = new URLSearchParams(window.location.search);
                    const page = Number(urlParams.get('page')) || 1;
                    if (page === 1) {
                        forceShuffle = true;
                    }
                }
                const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo`;
                const response = await fetch(fullUrl);
                if (!response.ok) throw new Error("Network response was not ok");
                const rawData = await response.json();
                const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);
                let finalData = [...data];

                if (typeof sessionStorage !== 'undefined') {
                    const cachedOrderStr = sessionStorage.getItem('githubReposOrder');
                    const getRepoKey = (r: any) => r._id || r.id || r.name;
                    
                    if (cachedOrderStr && !forceShuffle) {
                        try {
                            const cachedOrder: string[] = JSON.parse(cachedOrderStr);
                            const orderMap = new Map<string, number>(cachedOrder.map((id, index) => [id, index]));
                            finalData.sort((a, b) => {
                                const aKey = getRepoKey(a);
                                const bKey = getRepoKey(b);
                                const aIdx = orderMap.has(aKey) ? orderMap.get(aKey)! : 99999;
                                const bIdx = orderMap.has(bKey) ? orderMap.get(bKey)! : 99999;
                                return aIdx - bIdx;
                            });
                        } catch (e) {
                            console.error('Failed to parse cached order', e);
                        }
                    } else {
                        for (let i = finalData.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [finalData[i], finalData[j]] = [finalData[j], finalData[i]];
                        }
                        const order = finalData.map(t => getRepoKey(t));
                        sessionStorage.setItem('githubReposOrder', JSON.stringify(order));
                    }
                }

                setAllRepos(finalData);
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
                const params = new URLSearchParams(window.location.search);
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                
                const queryString = params.toString();
                const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                window.history.pushState(null, '', newUrl);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, searchParams]);

    const updateURL = (newCategory: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.pushState(null, '', newUrl);
    };

    const handleCategoryChange = (category: string) => {
        setLocalCategory(category);
        setLocalPage(1);
        updateURL(category, localSearchQuery, 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        setLocalPage(1);
    };

    const handlePageChange = (page: number) => {
        setLocalPage(page);
        updateURL(localCategory, localSearchQuery, page);
    };

    const filteredRepos = useMemo(() => {
        return allRepos.filter(repo => {
            const matchesCategory = localCategory === "All" ||
                repo.category.toLowerCase() === localCategory.toLowerCase();
            const matchesSearch = repo.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                repo.owner.toLowerCase().includes(localSearchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allRepos, localCategory, localSearchQuery]);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        const currentCat = searchParams.get('category') || 'All';
        const currentPg = Number(searchParams.get('page')) || 1;
        
        setLocalSearchQuery(currentQ);
        setLocalCategory(currentCat);
        setLocalPage(currentPg);
    }, [searchParams.get('q'), searchParams.get('category'), searchParams.get('page')]);

    const totalItems = filteredRepos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, localPage), totalPages);

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedRepos = filteredRepos.slice(startIndex, endIndex);

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setLocalPage(1);
    };

    return {
        displayedRepos,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        handleClearSearch,
        activeCategory: localCategory,
        handleCategoryChange,
        currentPage: validCurrentPage,
        handlePageChange,
        totalPages,
        totalItems
    };
}