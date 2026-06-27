'use server';

import { GithubRepo } from "@/types/githubRepo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchGithubReposData = async (): Promise<GithubRepo[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/githubrepo`;
        console.log('Fetching github repos data from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fullUrl})`);
        }
        const data = await response.json();

        let resultData: GithubRepo[] = [];

        if (!Array.isArray(data)) {
            if (data && Array.isArray(data.data)) {
                resultData = data.data;
            } else {
                console.error('API did not return an array:', data);
                return [];
            }
        } else {
            resultData = data;
        }

        for (let i = resultData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resultData[i], resultData[j]] = [resultData[j], resultData[i]];
        }

        return resultData;
    } catch (error) {
        console.error("Error fetching github repos data:", error);
        throw error;
    }
};



let useBackupTokenUntil = 0;

export const fetchGithubRepoDetails = async (owner: string, repoName: string, retryCount = 0): Promise<{repoData: any, mdFiles: any[]}> => {
    try {
        const tokens = [process.env.GITHUB_TOKEN, process.env.GITHUB_TOKEN2].filter(Boolean);
        let currentTokenIndex = 0;
        
        if (tokens.length > 1 && Date.now() < useBackupTokenUntil) {
            currentTokenIndex = 1;
        }

        const headers: Record<string, string> = {};
        if (tokens.length > 0) {
            headers['Authorization'] = `Bearer ${tokens[currentTokenIndex]}`;
        }

        const [repoRes, contentsRes, githubDirRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repoName}`, { 
                headers,
                next: { revalidate: 3600 } 
            }),
            fetch(`https://api.github.com/repos/${owner}/${repoName}/contents`, {
                headers,
                next: { revalidate: 3600 }
            }),
            fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/.github`, {
                headers,
                next: { revalidate: 3600 }
            })
        ]);

        const hasAuthError = [repoRes, contentsRes, githubDirRes].some(res => res.status === 403 || res.status === 401);

        if (hasAuthError && tokens.length > 1 && retryCount === 0) {
            if (currentTokenIndex === 0) {
                useBackupTokenUntil = Date.now() + 5 * 60 * 60 * 1000;
                console.warn(`Github API rate limit hit on Token 1. Switching to Token 2 for 5 hours. Retrying...`);
            } else {
                useBackupTokenUntil = 0;
                console.warn(`Github API rate limit hit on Token 2. Reverting back to Token 1. Retrying...`);
            }
            return fetchGithubRepoDetails(owner, repoName, retryCount + 1);
        }

        let repoData = null;
        let allFiles: any[] = [];

        if (repoRes.ok) {
            repoData = await repoRes.json();
        }

        if (contentsRes.ok) {
            const data = await contentsRes.json();
            if (Array.isArray(data)) allFiles.push(...data);
        }

        if (githubDirRes.ok) {
            const data = await githubDirRes.json();
            if (Array.isArray(data)) allFiles.push(...data);
        }

        // Filter files
        const filesToFetch = allFiles.filter((f: any) => {
            if (f.type !== 'file') return false;
            const name = f.name.toLowerCase();

            if (name.startsWith('readme') && name !== 'readme.md' && name !== 'readme.mdx') {
                return false;
            }

            return name.endsWith('.md') || name.endsWith('.mdx') || name === 'license' || name === 'code_of_conduct';
        });

        // Fetch contents
        const fetchedFiles = await Promise.all(
            filesToFetch.map(async (file: any) => {
                if (file.download_url) {
                    const res = await fetch(file.download_url, { 
                        headers,
                        next: { revalidate: 3600 }
                    });
                    if (res.status === 403 || res.status === 401) {
                        return { name: file.name, content: null, authError: true };
                    }
                    if (res.ok) {
                        return { name: file.name, content: await res.text() };
                    }
                }
                return { name: file.name, content: null };
            })
        );

        if (fetchedFiles.some(f => f.authError) && tokens.length > 1 && retryCount === 0) {
            if (currentTokenIndex === 0) {
                useBackupTokenUntil = Date.now() + 5 * 60 * 60 * 1000;
                console.warn(`Github API rate limit hit on file download using Token 1. Switching to Token 2 for 5 hours. Retrying...`);
            } else {
                useBackupTokenUntil = 0;
                console.warn(`Github API rate limit hit on file download using Token 2. Reverting back to Token 1. Retrying...`);
            }
            return fetchGithubRepoDetails(owner, repoName, retryCount + 1);
        }

        const validFiles = fetchedFiles.filter(f => f.content);

        const uniqueFilesMap = new Map<string, {name: string, content: string}>();
        for (const f of validFiles) {
            const lowerName = f.name.toLowerCase();
            if (!uniqueFilesMap.has(lowerName)) {
                uniqueFilesMap.set(lowerName, f as {name: string, content: string});
            }
        }
        
        let mdFiles = Array.from(uniqueFilesMap.values());

        const getPriority = (name: string) => {
            const lower = name.toLowerCase();
            if (lower.startsWith('readme')) return 1;
            if (lower.startsWith('code_of_conduct')) return 2;
            if (lower.startsWith('contributing')) return 3;
            if (lower.startsWith('license')) return 4;
            return 5;
        };

        mdFiles.sort((a, b) => {
            const pA = getPriority(a.name);
            const pB = getPriority(b.name);
            if (pA !== pB) return pA - pB;
            return a.name.localeCompare(b.name);
        });

        return { repoData, mdFiles };
    } catch (error) {
        console.error("Error fetching data from Github API:", error);
        return { repoData: null, mdFiles: [] };
    }
};