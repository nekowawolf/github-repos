import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import { fetchGithubReposData, fetchGithubRepoDetails } from "@/services/githubRepoService";
import Link from "next/link";
import { FaExternalLinkAlt, FaCode, FaServer, FaDatabase, FaShieldAlt, FaGraduationCap, FaGithub, FaMarkdown } from "react-icons/fa";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDesignServices } from "react-icons/md";
import BackButton from "@/components/BackButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
             <div className="glass-card rounded-3xl p-8 border border-white/10 overflow-hidden mt-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 pb-4 border-b border-white/10">
                    <FaMarkdown className="text-blue-400" />
                    README.md
                </h2>
                <div className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl prose-a:text-blue-400 hover:prose-a:text-blue-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
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