'use server';

import { GithubRepo } from "@/types/githubRepo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchGithubReposData = async (): Promise<GithubRepo[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/githubrepo`;
        console.log('Fetching github repos data from:', fullUrl);

        const response = await fetch(fullUrl, { next: { revalidate: 3600 } });
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



export const fetchGithubRepoDetails = async (owner: string, repoName: string) => {
    try {
        const headers: Record<string, string> = {};
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
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
                    if (res.ok) {
                        return { name: file.name, content: await res.text() };
                    }
                }
                return { name: file.name, content: null };
            })
        );

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