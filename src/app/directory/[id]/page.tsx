import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import { fetchGithubReposData } from "@/services/githubRepoService";
import DetailClient from "./DetailClient";

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

export default function GithubRepoDetails() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}