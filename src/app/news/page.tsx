import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = githubRepoMetadata("News", "The latest news and updates.");

export default function NewsPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
