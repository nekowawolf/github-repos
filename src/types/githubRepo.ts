export interface GithubStats {
    stars: number;
    forks: number;
    language: string;
    image_url: string;
    last_update?: string;
}

export interface GithubRepo {
    _id: string;
    name: string;
    description: string;
    category: string;
    repo_url: string;
    owner: string;
    repo_name: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    created_at?: string;
    stats?: GithubStats;
    added_by?: AddedByInfo;
}

export interface AddedByInfo {
    name?: string;
    url?: string;
}