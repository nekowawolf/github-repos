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

export interface RepoGrowthStats {
    stars: number;
    forks: number;
}

export interface RepoHistoryData {
    period: string;
    available: boolean;
    current: RepoGrowthStats;
    previous: RepoGrowthStats | null;
    growth: RepoGrowthStats | null;
}

export interface RepoHistoryResponse {
    message: string;
    data: RepoHistoryData;
}