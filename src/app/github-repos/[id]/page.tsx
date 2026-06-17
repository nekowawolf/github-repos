import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import { fetchGithubReposData, fetchGithubRepoDetails } from "@/services/githubRepoService";
import Link from "next/link";
import { FaExternalLinkAlt, FaStar, FaCodeBranch, FaRegClock, FaCode } from "react-icons/fa";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import BackButton from "@/components/BackButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const reposData = await fetchGithubReposData();
  const repo = reposData.find((t) => t._id.toString() === resolvedParams.id);
  if (!repo) return dashboardMetadata("Not Found", "Repository not found");
  return dashboardMetadata(repo.name, repo.description);
}

export default async function GithubRepoDetails({ params }: Props) {
  const resolvedParams = await params;
  const reposData = await fetchGithubReposData();
  const repo = reposData.find((t) => t._id.toString() === resolvedParams.id);

  if (!repo) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-36 min-h-screen flex items-center justify-center text-fill-color">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Repository Not Found</h1>
            <Link href="/github-repos" className="text-blue-500 hover:underline">
              Back to GitHub Repos
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { repoData, readme } = await fetchGithubRepoDetails(repo.owner, repo.repo_name);

  return (
    <>
      <Header />
      <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <BackButton fallbackUrl="/github-repos" />

          {/* Header Section */}
          <div className="glass-card rounded-3xl p-7 mb-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <FaCode className="w-64 h-64" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    {repo.name}
                    </h1>
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 font-medium whitespace-nowrap self-start md:self-auto">
                        {repo.category}
                    </span>
                </div>

                <p className="text-fill-color/80 leading-relaxed max-w-3xl text-lg mb-6">
                  {repo.description}
                </p>

                {/* GitHub Live Stats */}
                {repoData && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                            <FaStar className="text-yellow-400 w-5 h-5" />
                            <div>
                                <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Stars</div>
                                <div className="font-mono text-lg font-bold">{repoData.stargazers_count?.toLocaleString() || 0}</div>
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                            <FaCodeBranch className="text-blue-400 w-5 h-5" />
                            <div>
                                <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Forks</div>
                                <div className="font-mono text-lg font-bold">{repoData.forks_count?.toLocaleString() || 0}</div>
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                            <FaCode className="text-green-400 w-5 h-5" />
                            <div>
                                <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Language</div>
                                <div className="font-semibold">{repoData.language || 'Multiple'}</div>
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                            <FaRegClock className="text-purple-400 w-5 h-5" />
                            <div>
                                <div className="text-xs text-fill-color/50 uppercase font-bold tracking-wider mb-1">Updated</div>
                                <div className="text-sm font-medium">
                                    {new Date(repoData.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
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

          {/* README Section */}
          {readme && (
             <div className="glass-card rounded-3xl p-8 border border-white/10 overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 pb-4 border-b border-white/10">
                    <FaCode className="text-blue-400" />
                    README.md
                </h2>
                <div className="prose prose-invert prose-blue max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {readme}
                    </ReactMarkdown>
                </div>
             </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}