import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogArticle from '@/components/blog/BlogArticle';
import { fetchBlogPost, fetchBlogPosts } from '@/services/blogService';
import { githubRepoMetadata } from '@/constants/metadataTemplates';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return {
    ...githubRepoMetadata(post.name, post.description, false),
    authors: [{ name: post.added_by.name, url: post.added_by.url }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      siteName: 'Nww',
      title: post.name,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.created_at,
      authors: [post.added_by.name],
      images: [{ url: post.image_url, alt: post.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.name,
      description: post.description,
      images: [post.image_url],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return <><Header /><BlogArticle post={post} /><Footer /></>;
}