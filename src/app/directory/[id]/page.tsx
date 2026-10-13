import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import { fetchGithubReposData } from "@/services/githubRepoService";
import DetailClient from "./DetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const reposData = await fetchGithubReposData();
  const repo = reposData.find((t) => t._id.toString() === resolvedParams.id);
  if (!repo) return githubRepoMetadata("Not Found", "Repository not found", false);
  return githubRepoMetadata(repo.name, repo.description, false);
}

export default function GithubRepoDetails() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}