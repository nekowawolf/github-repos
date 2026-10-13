import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { githubRepoMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";
import { fetchBlogPosts } from "@/services/blogService";

export const metadata = githubRepoMetadata("Blog", "Articles, reviews, deep dives, and analysis.");

export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  return (
    <>
      <Header />
      <DetailClient posts={posts} />
      <Footer />
    </>
  );
}