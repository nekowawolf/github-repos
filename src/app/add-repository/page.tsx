import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import AddRepositoryClient from "./AddRepositoryClient";

export const metadata = githubRepoMetadata("Add Repository", "Submit a new repository.");

export default function AddRepositoryPage() {
  return (
    <>
      <Header />
      <AddRepositoryClient />
      <Footer />
    </>
  );
}