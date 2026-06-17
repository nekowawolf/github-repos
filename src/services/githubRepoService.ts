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

const promiseAny = <T>(promises: Promise<T>[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        let rejectedCount = 0;
        if (promises.length === 0) {
            reject(new Error("Empty promise list"));
            return;
        }
        promises.forEach((p) => {
            Promise.resolve(p)
                .then(resolve)
                .catch(() => {
                    rejectedCount++;
                    if (rejectedCount === promises.length) {
                        reject(new Error("All promises rejected"));
                    }
                });
        });
    });
};

const fetchFirstSuccessful = async (urls: string[]): Promise<string | null> => {
    try {
        return await promiseAny(
            urls.map(async (url) => {
                const res = await fetch(url, { next: { revalidate: 3600 } });
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim()) {
                        return text;
                    }
                }
                throw new Error(`Not found or empty: ${url}`);
            })
        );
    } catch {
        return null;
    }
};

export const fetchGithubRepoDetails = async (owner: string, repoName: string) => {
    try {
        const [repoRes, readmeRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repoName}`, { next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' },
                next: { revalidate: 3600 }
            }),
        ]);

        let repoData = null;
        let readme = null;

        if (repoRes.ok) {
            repoData = await repoRes.json();
        }

        if (readmeRes.ok) {
            readme = await readmeRes.text();
        }

        const branches = repoData?.default_branch ? [repoData.default_branch] : ['main', 'master'];

        const getUrls = (paths: string[]) => 
            branches.flatMap(branch => 
                paths.map(path => `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${path}`)
            );

        const licensePaths = [
            'LICENSE', 'LICENSE.md', 'License', 'license', 'LICENSE.txt',
            '.github/LICENSE', '.github/LICENSE.md', '.github/LICENSE.txt',
            '.github/License', '.github/license'
        ];

        const contributingPaths = [
            'CONTRIBUTING.md', 'contributing.md', 'Contributing.md',
            'CONTRIBUTING', 'contributing', 'Contributing',
            '.github/CONTRIBUTING.md', '.github/contributing.md', '.github/Contributing.md',
            '.github/CONTRIBUTING', '.github/contributing', '.github/Contributing'
        ];

        const cocPaths = [
            'CODE_OF_CONDUCT.md', 'code_of_conduct.md', 'Code_Of_Conduct.md', 'CodeOfConduct.md', 'Code_of_conduct.md',
            'CODE_OF_CONDUCT', 'code_of_conduct', 'CodeOfConduct',
            '.github/CODE_OF_CONDUCT.md', '.github/code_of_conduct.md', '.github/Code_Of_Conduct.md', '.github/CodeOfConduct.md', '.github/Code_of_conduct.md',
            '.github/CODE_OF_CONDUCT', '.github/code_of_conduct', '.github/CodeOfConduct'
        ];

        const [license, contributing, codeOfConduct] = await Promise.all([
            fetchFirstSuccessful(getUrls(licensePaths)),
            fetchFirstSuccessful(getUrls(contributingPaths)),
            fetchFirstSuccessful(getUrls(cocPaths))
        ]);

        return { repoData, readme, license, contributing, codeOfConduct };
    } catch (error) {
        console.error("Error fetching data from Github API:", error);
        return { repoData: null, readme: null, license: null, contributing: null, codeOfConduct: null };
    }
};