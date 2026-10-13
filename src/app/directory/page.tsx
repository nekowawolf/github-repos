import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GithubReposContent from "./GithubReposContent";
import { githubRepoMetadata } from "@/constants/metadataTemplates";

export const metadata = githubRepoMetadata("GitHub Repos", "Explore a curated directory of GitHub repositories to find useful tools and projects across every category.");

export default function GithubReposPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <GithubReposContent />
      </main>
      <Footer />
    </>
  );
}