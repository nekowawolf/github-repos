import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GithubReposContent from "./GithubReposContent";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("GitHub Repos", "Explore top GitHub repositories");

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