import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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