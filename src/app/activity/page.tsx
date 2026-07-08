import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
