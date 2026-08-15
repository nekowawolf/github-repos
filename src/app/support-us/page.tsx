import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import SupportUsClient from "./SupportUsClient";

export const metadata = githubRepoMetadata("Support Us", "Support nww ecosystem and help us keep building.");

export default function SupportUsPage() {
  return (
    <>
      <Header />
      <SupportUsClient />
      <Footer />
    </>
  );
}