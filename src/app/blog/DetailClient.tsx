'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import Pagination2 from '@/components/common/Pagination2';
import { FallbackImage } from '@/components/common/FallbackImage';
import BlogAuthor from '@/components/blog/BlogAuthor';
import BlogSortDropdown from '@/components/blog/BlogSortDropdown';
import NwwOneeAIChat from '@/components/chat/NwwOneeAIChat';
import { BLOG_POSTS_PER_PAGE, filterBlogPosts } from '@/lib/blog';
import type { BlogPost, BlogSort } from '@/types/blog';

export default function DetailClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<BlogSort>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const filteredPosts = useMemo(() => filterBlogPosts(posts, query, sort), [posts, query, sort]);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOG_POSTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const visiblePosts = filteredPosts.slice((page - 1) * BLOG_POSTS_PER_PAGE, page * BLOG_POSTS_PER_PAGE);

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setCurrentPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-screen body-color text-fill-color px-4 pb-16 pt-36 sm:px-8 font-sans">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
          className="w-full mb-12 flex flex-col items-start text-left space-y-2"
        >
          <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">/blog</h1>
          <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
            Articles, reviews, and technical deep dives covering open-source repositories.
          </p>
        </motion.header>

        <div ref={resultsRef} className="scroll-mt-28">
          <div className="flex w-full max-w-2xl items-center gap-3">
            <div className="search-container relative min-w-0 flex-1">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <FiSearch aria-hidden="true" className="search-icon pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fill-color/60" />
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }}
                placeholder="Search articles..."
                className="blog-search custom-search-focus card-color border border-color h-12 w-full rounded-full py-3 pl-11 pr-11 text-sm text-fill-color placeholder:text-[rgba(var(--fill-color-rgb),0.5)]"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => { setQuery(''); setCurrentPage(1); }}
                  className="blog-focus absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-fill-color/60 hover:!text-blue-500"
                >
                  <FiX aria-hidden="true" />
                </button>
              )}
            </div>
            <BlogSortDropdown value={sort} onChange={(value) => { setSort(value); setCurrentPage(1); }} />
          </div>

          <div className="mb-5 mt-6 flex items-center justify-between gap-3 text-xs text-fill-color/60">
            <p role="status">{filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}{query.trim() ? ' found' : ''}</p>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {visiblePosts.map((post) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
                className="group min-w-0"
              >
                <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.name}`} className="blog-focus block cursor-pointer overflow-hidden rounded-xl">
                  <FallbackImage
                    src={post.image_url}
                    alt={post.name}
                    width={1200}
                    height={675}
                    className="aspect-video w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                </Link>
                <div className="pt-4">
                  <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                    <Link href={`/blog/${post.slug}`} className="blog-focus cursor-pointer hover:!text-blue-500">{post.name}</Link>
                  </h2>
                  <div className="mt-3">
                    <BlogAuthor post={post} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-1 text-center">
              <FallbackImage
                src="https://cdn.nekowawolf.xyz/image/2026/1787422427_nwwonee_search.webp"
                alt="No data found"
                width={160}
                height={160}
                className="mx-auto"
              />
              <p className="-mt-4 text-fill-color/50">No data available.</p>
            </div>
          ) : totalPages > 1 ? (
            <div className="mt-12 flex justify-center">
              <Pagination2 currentPage={page} itemsPerPage={BLOG_POSTS_PER_PAGE} totalItems={filteredPosts.length} onPageChange={changePage} />
            </div>
          ) : null}
        </div>
      </div>
      <NwwOneeAIChat />
    </main>
  );
}