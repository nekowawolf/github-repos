import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dashboardMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = dashboardMetadata("Activity", "Web activity.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
