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

        return resultData;
    } catch (error) {
        console.error("Error fetching github repos data:", error);
        throw error;
    }
};

export const fetchGithubRepoDetails = async (owner: string, repoName: string) => {
    try {
        const [repoRes, readmeRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repoName}`, { next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' },
                next: { revalidate: 3600 }
            })
        ]);

        let repoData = null;
        let readme = null;

        if (repoRes.ok) {
            repoData = await repoRes.json();
        }

        if (readmeRes.ok) {
            readme = await readmeRes.text();
        }

        return { repoData, readme };
    } catch (error) {
        console.error("Error fetching data from Github API:", error);
        return { repoData: null, readme: null };
    }
}