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

export const submitGithubRepo = async (repoUrl: string, name: string, link: string, turnstileToken: string) => {
    try {
        const fullUrl = `${API_BASE_URL}/repo-submissions`;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repo_url: repoUrl,
                name: name,
                link: link,
                turnstile_token: turnstileToken
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit repository');
        }
        
        return data;
    } catch (error) {
        console.error("Error submitting github repo:", error);
        throw error;
    }
};

export const fetchGithubRepoHistory = async (id: string, period: string) => {
    try {
        const fullUrl = `${API_BASE_URL}/githubrepo/${id}/history?period=${period}`;
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            console.warn(`Failed to fetch history for ${id}: ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching github repo history:", error);
        return null;
    }
};