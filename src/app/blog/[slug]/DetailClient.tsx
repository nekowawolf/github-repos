'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import BlogArticle from '@/components/blog/BlogArticle';
import { Spinner } from '@/components/ui/spinner';
import { fetchBlogPost } from '@/services/blogService';
import type { BlogPost } from '@/types/blog';

type BlogResult = {
  slug: string;
  post?: BlogPost;
  error?: Error;
};

export default function DetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const [result, setResult] = useState<BlogResult | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      try {
        const post = await fetchBlogPost(slug);
        if (active) setResult({ slug, post });
      } catch (error) {
        if (active) {
          setResult({ slug, error: error instanceof Error ? error : new Error('Failed to fetch GitHub blog') });
        }
      }
    }

    loadPost();
    return () => { active = false; };
  }, [slug]);

  if (!result || result.slug !== slug) {
    return (
      <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans flex items-center justify-center">
        <Spinner className="text-blue-500 size-12" />
      </main>
    );
  }

  if (result.error) throw result.error;
  if (!result.post) notFound();

  return <BlogArticle post={result.post} />;
}