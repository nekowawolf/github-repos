'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaExternalLinkAlt, FaCode, FaServer, FaDatabase, FaShieldAlt, FaGraduationCap, FaGithub } from "react-icons/fa";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDesignServices } from "react-icons/md";
import BackButton from "@/components/BackButton";
import RepoContentTabs from "@/components/RepoContentTabs";
import { fetchGithubReposData, fetchGithubRepoDetails } from "@/services/githubRepoService";
import { GithubRepo } from "@/types/githubRepo";
import { Spinner } from "@/components/ui/spinner";

const getCategoryIcon = (category: string, className: string = "w-8 h-8") => {
    switch (category.toLowerCase()) {
        case 'automation': return <RiRobot2Line className={className} />;
        case 'ai': return <GoCpu className={className} />;
        case 'development': return <FaCode className={className} />;
        case 'infrastructure': return <FaServer className={className} />;
        case 'data': return <FaDatabase className={className} />;
        case 'security': return <FaShieldAlt className={className} />;
        case 'learning': return <FaGraduationCap className={className} />;
        case 'design': return <MdOutlineDesignServices className={className} />;
        default: return <FaGithub className={className} />;
    }
};

export default function DetailClient() {
    const { id } = useParams();
    const [repo, setRepo] = useState<GithubRepo | null>(null);
    const [repoData, setRepoData] = useState<any>(null);
    const [readme, setReadme] = useState<string | null>(null);
    const [license, setLicense] = useState<string | null>(null);
    const [contributing, setContributing] = useState<string | null>(null);
    const [codeOfConduct, setCodeOfConduct] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            setLoading(true);
            try {
                const repos = await fetchGithubReposData();
                const foundRepo = repos.find((t) => t._id.toString() === id);
                if (foundRepo) {
                    setRepo(foundRepo);
                    const details = await fetchGithubRepoDetails(foundRepo.owner, foundRepo.repo_name);
                    setRepoData(details.repoData);
                    setReadme(details.readme);
                    setLicense(details.license);
                    setContributing(details.contributing);
                    setCodeOfConduct(details.codeOfConduct);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans flex items-center justify-center">
                <Spinner className="text-blue-500 size-12" />
            </main>
        );
    }

    if (!repo) {
        return (
            <main className="flex-grow pt-36 min-h-screen flex items-center justify-center text-fill-color">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Repository Not Found</h1>
                    <Link href="/github-repos" className="text-blue-500 hover:underline">
                        Back to GitHub Repos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <BackButton fallbackUrl="/github-repos" label="Back to list" />

                {/* Header Section */}
                <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 transform translate-y-1/2 opacity-[0.03] pointer-events-none">
                        {getCategoryIcon(repo.category, "w-64 h-64")}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-blue-500">
                                    {repo.name}
                                </h1>
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/20 whitespace-nowrap self-start md:self-auto">
                                    {repo.category}
                                </span>
                            </div>

                            <p className="text-fill-color/70 leading-relaxed max-w-3xl text-lg mb-6">
                                {repo.description}
                            </p>

                            {/* GitHub Live Stats */}
                            {repoData && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                        <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Stars</div>
                                        <div className="font-mono text-xl font-bold text-fill-color">{repoData.stargazers_count?.toLocaleString() || 0}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                        <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Forks</div>
                                        <div className="font-mono text-xl font-bold text-fill-color">{repoData.forks_count?.toLocaleString() || 0}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                        <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Language</div>
                                        <div className="font-semibold text-xl text-fill-color">{repoData.language || 'Multiple'}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                        <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Updated</div>
                                        <div className="text-sm font-medium text-fill-color">
                                            {new Date(repoData.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Button */}
                            <div className="flex flex-wrap items-center gap-4">
                                {repo.repo_url && (
                                    <a
                                        href={repo.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        View Repository
                                        <FaExternalLinkAlt className="w-3.5 h-3.5" />
                                    </a>
                                )}

                                <div className="flex items-center gap-3 ml-auto sm:ml-4 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                                    {repo.twitter && (
                                        <a href={repo.twitter} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-blue-400 transition-all text-fill-color">
                                            <FaXTwitter className="w-5 h-5" />
                                        </a>
                                    )}
                                    {repo.discord && (
                                        <a href={repo.discord} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-indigo-400 transition-all text-fill-color">
                                            <BsDiscord className="w-5 h-5" />
                                        </a>
                                    )}
                                    {repo.telegram && (
                                        <a href={repo.telegram} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-blue-500 transition-all text-fill-color">
                                            <FaTelegram className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <RepoContentTabs
                    readme={readme}
                    license={license}
                    contributing={contributing}
                    codeOfConduct={codeOfConduct}
                    licenseName={repoData?.license?.name}
                    owner={repo.owner}
                    repoName={repo.repo_name}
                    defaultBranch={repoData?.default_branch || 'master'}
                />
            </div>
        </main>
    );
}