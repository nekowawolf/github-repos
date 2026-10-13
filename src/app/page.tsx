import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { githubRepoMetadata } from "@/constants/metadataTemplates";

export const metadata = githubRepoMetadata("Home", "Explore a curated directory of GitHub repositories to find useful tools and projects across every category.");

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
      </main>
      <Footer />
    </>
  );
}