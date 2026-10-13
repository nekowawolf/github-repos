import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = githubRepoMetadata("Activity", "Web activity.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
