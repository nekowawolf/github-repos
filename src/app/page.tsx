import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("Home", "Welcome to Nww");

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