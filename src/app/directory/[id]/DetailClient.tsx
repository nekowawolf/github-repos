'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaExternalLinkAlt, FaCode, FaServer, FaDatabase, FaShieldAlt, FaGraduationCap, FaStar, FaCodeBranch, FaRegClock, FaRegUserCircle, FaGlobe, FaRegFileImage, FaFileAlt } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDesignServices, MdOutlineOndemandVideo } from "react-icons/md";
import { LuAudioLines } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import BackButton from "@/components/BackButton";
import RepoContentTabs from "@/components/RepoContentTabs";
import { fetchGithubRepoDetails } from "@/services/githubRepoService";
import { GithubRepo } from "@/types/githubRepo";
import { Spinner } from "@/components/ui/spinner";
import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";

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
        case 'image': return <FaRegFileImage className={className} />;
        case 'video': return <MdOutlineOndemandVideo className={className} />;
        case 'audio': return <LuAudioLines className={className} />;
        case 'document': return <FaFileAlt className={className} />;
        default: return null;
    }
};

const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

export default function DetailClient() {
    const { id } = useParams();
    const [repo, setRepo] = useState<GithubRepo | null>(null);
    const [repoData, setRepoData] = useState<any>(null);
    const [mdFiles, setMdFiles] = useState<{name: string, content: string}[]>([]);
    const [suggestedRepos, setSuggestedRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 1500) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            setLoading(true);
            try {
                const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/githubrepo`;
                const response = await fetch(fullUrl);
                if (!response.ok) throw new Error("Network response was not ok");
                const rawData = await response.json();
                const repos: GithubRepo[] = Array.isArray(rawData) ? rawData : (rawData?.data || []);
                const foundRepo = repos.find((t) => t._id.toString() === id);
                if (foundRepo) {
                    setRepo(foundRepo);
                    
                    const otherRepos = repos.filter(r => r._id.toString() !== id);
                    const sameCat = otherRepos.filter(r => r.category === foundRepo.category);
                    const shuffledSame = [...sameCat].sort(() => 0.5 - Math.random());
                    const selectedSame = shuffledSame.slice(0, 3);
                    
                    const remaining = otherRepos.filter(r => !selectedSame.some(s => s._id === r._id));
                    const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
                    const selectedRand = shuffledRemaining.slice(0, 3);
                    
                    setSuggestedRepos([...selectedSame, ...selectedRand].sort(() => 0.5 - Math.random()));

                    const details = await fetchGithubRepoDetails(foundRepo.owner, foundRepo.repo_name);
                    setRepoData(details.repoData);
                    setMdFiles(details.mdFiles);
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
                <div className="text-center flex flex-col items-center">
                    <img
                        src="https://nekowawolf.github.io/cdn-images/images/2026/1784476217_nwwonee_search.webp"
                        alt="Repository Not Found"
                        width={160}
                        height={160}
                        className="mx-auto mb-2"
                    />
                    <h1 className="text-lg font-bold mb-6 text-fill-color/50">Repository Not Found</h1>
                    <Link href="/directory" className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20">
                        Back to GitHub Repos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <BackButton fallbackUrl="/directory" label="Back to list" />

                {/* Header Section */}
                <div className="glass-card rounded-3xl p-7 mb-8 border border-[var(--border-divider)] relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 transform translate-y-1/2 opacity-[0.03] pointer-events-none">
                        {getCategoryIcon(repo.category, "w-64 h-64")}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4 w-full min-w-0">
                                    <a 
                                        href={`https://github.com/${repo.owner}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="cursor-pointer shrink-0"
                                    >
                                        {repo.stats?.image_url ? (
                                            <img
                                                src={repo.stats.image_url}
                                                alt={repo.owner}
                                                width={80}
                                                height={80}
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-[var(--border-divider)]"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {getCategoryIcon(repo.category, "w-8 h-8 md:w-10 md:h-10")}
                                            </div>
                                        )}
                                    </a>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <a 
                                            href={`https://github.com/${repo.owner}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="cursor-pointer text-sm md:text-base font-mono opacity-70 hover:opacity-100 transition-opacity text-fill-color mb-1 truncate max-w-full block"
                                            title={`@${repo.owner}`}
                                        >
                                            @{repo.owner}
                                        </a>
                                        <h1 className="text-3xl md:text-4xl font-bold text-fill-color break-words">
                                            {repo.name}
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-start mt-2 md:mt-0">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 whitespace-nowrap">
                                        {repo.category}
                                    </span>
                                    <button 
                                        onClick={() => {
                                            chatStore.setIsOpen(true);
                                            chatStore.setActiveView('user');
                                        }}
                                        className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color"
                                    >
                                        <CiBookmark className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-fill-color/70 leading-relaxed max-w-3xl text-lg mb-6">
                                {repo.description}
                            </p>

                            {/* GitHub Live Stats */}
                            {repoData && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-[rgba(var(--fill-color-rgb),0.05)] rounded-xl p-4 border border-[var(--border-divider)] flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs text-fill-color/70 uppercase font-bold tracking-wider mb-1">
                                            <FaStar className="w-3.5 h-3.5" />
                                            Stars
                                        </div>
                                        <div className="font-mono text-xl font-bold text-fill-color">{(repo.stats?.stars ?? repoData.stargazers_count ?? 0).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-[rgba(var(--fill-color-rgb),0.05)] rounded-xl p-4 border border-[var(--border-divider)] flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs text-fill-color/70 uppercase font-bold tracking-wider mb-1">
                                            <FaCodeBranch className="w-3.5 h-3.5" />
                                            Forks
                                        </div>
                                        <div className="font-mono text-xl font-bold text-fill-color">{(repo.stats?.forks ?? repoData.forks_count ?? 0).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-[rgba(var(--fill-color-rgb),0.05)] rounded-xl p-4 border border-[var(--border-divider)] flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs text-fill-color/70 uppercase font-bold tracking-wider mb-1">
                                            <FaCode className="w-3.5 h-3.5" />
                                            Language
                                        </div>
                                        <div className="font-semibold text-xl text-fill-color">{repo.stats?.language || repoData.language || 'N/A'}</div>
                                    </div>
                                    <div className="bg-[rgba(var(--fill-color-rgb),0.05)] rounded-xl p-4 border border-[var(--border-divider)] flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs text-fill-color/70 uppercase font-bold tracking-wider mb-1">
                                            <FaRegClock className="w-3.5 h-3.5" />
                                            Updated
                                        </div>
                                        <div className="text-sm font-medium text-fill-color">
                                            {new Date(repo.stats?.last_update || repoData.pushed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-[15px] sm:text-[15px] text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <FaExternalLinkAlt className="w-[15px] h-[15px] sm:w-3.5 sm:h-3.5" />
                                        Repository
                                    </a>
                                )}

                                {(repo.website || repo.twitter || repo.instagram || repo.discord) && (
                                    <div className="flex items-center gap-4 ml-auto sm:ml-4 bg-[rgba(var(--fill-color-rgb),0.05)] px-4 py-2 sm:px-4 sm:py-2 rounded-xl border border-[var(--border-divider)]">
                                        {repo.website && (
                                            <a href={repo.website} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color">
                                                <FaGlobe className="w-[19px] h-[19px] sm:w-[18px] sm:h-[18px]" />
                                            </a>
                                        )}
                                        {repo.twitter && (
                                            <a href={repo.twitter} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color">
                                                <FaXTwitter className="w-[19px] h-[19px] sm:w-[18px] sm:h-[18px]" />
                                            </a>
                                        )}
                                        {repo.instagram && (
                                            <a href={repo.instagram} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color">
                                                <FaInstagram className="w-[19px] h-[19px] sm:w-[18px] sm:h-[18px]" />
                                            </a>
                                        )}
                                        {repo.discord && (
                                            <a href={repo.discord} target="_blank" rel="noopener noreferrer" className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color">
                                                <BsDiscord className="w-[19px] h-[19px] sm:w-[18px] sm:h-[18px]" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <RepoContentTabs
                    mdFiles={mdFiles}
                    licenseName={repoData?.license?.name}
                    owner={repo.owner}
                    repoName={repo.repo_name}
                    defaultBranch={repoData?.default_branch || 'master'}
                />

                {/* Suggested Repositories Section */}
                {suggestedRepos.length > 0 && (
                    <div className="glass-card rounded-3xl p-8 mt-8 mb-8 border border-[var(--border-divider)] overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-divider)]">
                            <h2 className="text-2xl font-bold text-fill-color">Explore Other Repositories</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {suggestedRepos.map((sRepo) => (
                                <Link 
                                    key={sRepo._id} 
                                    href={`/directory/${sRepo._id}`}
                                    className="flex flex-col h-full p-5 rounded-2xl bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] hover:bg-[rgba(var(--fill-color-rgb),0.06)] hover:border-blue-500/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {sRepo.stats?.image_url ? (
                                                <img
                                                    src={sRepo.stats.image_url}
                                                    alt={sRepo.owner}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover border border-[var(--border-divider)] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                                    {getCategoryIcon(sRepo.category, "w-5 h-5")}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] text-fill-color/60 font-mono truncate" title={`@${sRepo.owner}`}>@{sRepo.owner}</span>
                                                <h3 className="text-sm font-bold text-fill-color group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {sRepo.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap ml-2">
                                            {sRepo.category}
                                        </span>
                                    </div>
                                    
                                    <p className="text-xs text-fill-color/60 line-clamp-2 mb-4 flex-grow">
                                        {sRepo.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--border-divider)] text-fill-color/70 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <FaStar className="w-3.5 h-3.5" />
                                            <span>{formatNumber(sRepo.stats?.stars || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaCodeBranch className="w-3.5 h-3.5" />
                                            <span>{formatNumber(sRepo.stats?.forks || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaCode className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-[80px]">{sRepo.stats?.language || 'N/A'}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll to Top Button */}
            <div className={`fixed bottom-24 right-7 z-50 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <IoIosArrowUp className="w-6 h-6" />
                </button>
            </div>
            <NwwOneeAIChat />
        </main>
    );
}