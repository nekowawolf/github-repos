'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight, FiLink } from 'react-icons/fi';
import { CiBookmark } from 'react-icons/ci';
import { toast } from 'sonner';
import { FallbackImage } from '@/components/common/FallbackImage';
import BlogAuthor from '@/components/blog/BlogAuthor';
import BlogArticleControls from '@/components/blog/BlogArticleControls';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import { chatStore } from '@/components/chat/NwwOneeAIChat';
import { getBlogHeadings, getYouTubeEmbedUrl } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';

export default function BlogArticle({ post }: { post: BlogPost }) {
  const reducedMotion = useReducedMotion();
  const headings = useMemo(() => getBlogHeadings(post), [post]);
  const videoUrl = getYouTubeEmbedUrl(post.media.video_url);

  async function copyArticleLink() {
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      url.search = '';
      await navigator.clipboard.writeText(url.toString());
      toast.success('Article link copied');
    } catch {
      toast.error('Could not copy the link. You can copy it from your address bar.');
    }
  }

  return (
    <main className="body-color text-fill-color min-h-screen px-4 pb-12 pt-28 sm:px-8 sm:pt-36">
      <article className="mx-auto max-w-3xl lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-x-12">
        <Link href="/blog" className="blog-focus mb-8 inline-flex cursor-pointer items-center gap-2 justify-self-start text-sm text-fill-color/70 hover:!text-blue-500 lg:col-span-2">
          <FiArrowLeft aria-hidden="true" /> All articles
        </Link>
        <header className="min-w-0 lg:col-start-1">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-[1.15]">{post.name}</h1>
          <p className="mt-5 text-base leading-8 text-fill-color/70 sm:text-lg">{post.description}</p>
          <div className="mt-7">
            <BlogAuthor post={post} variant="article" actions={
              <>
                <button type="button" onClick={copyArticleLink} className="blog-focus inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-color px-2.5 text-[11px] text-fill-color/70 hover:!text-blue-500 sm:h-10 sm:gap-2 sm:px-3.5 sm:text-xs">
                  <FiLink aria-hidden="true" className="h-4 w-4" /> Copy link
                </button>
                <button
                  type="button"
                  aria-label="Save article"
                  title="Save article"
                  onClick={() => { chatStore.setIsOpen(true); chatStore.setActiveView('user'); }}
                  className="blog-focus flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-color text-fill-color/70 hover:!text-blue-500 sm:h-10 sm:w-10"
                >
                  <CiBookmark aria-hidden="true" className="h-5 w-5" />
                </button>
              </>
            } />
          </div>
        </header>

        <div className="mx-auto mt-9 w-full -translate-x-0.4 overflow-hidden rounded-2xl border border-color sm:translate-x-0 sm:mt-10 lg:col-start-1">
          <FallbackImage src={post.image_url} alt={post.name} width={1600} height={900} fetchPriority="high" className="mx-auto block h-auto w-full object-contain object-center" />
        </div>

        <div className="mt-10 min-w-0 lg:col-span-2 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
          <div className="blog-body min-w-0">
            {post.content.map((section) => (
              <motion.section
                key={section._id}
                initial={false}
                whileInView={{ opacity: [0.85, 1], y: reducedMotion ? 0 : [8, 0] }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
                aria-labelledby={section._id}
                className="mb-12 last:mb-0"
              >
                <h2 id={section._id} tabIndex={-1}>{section.name}</h2>
                {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}

                {section.screenshot && post.media.screenshot_urls[section.screenshot.index] && (
                  <figure className="mx-auto my-8 w-full --translate-x-0.4 sm:translate-x-0">
                    <a
                      href={post.media.screenshot_urls[section.screenshot.index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-focus block cursor-pointer overflow-hidden rounded-xl border border-color card-color2"
                      aria-label={`Open image: ${section.screenshot.description} (new tab)`}
                    >
                      <FallbackImage
                        src={post.media.screenshot_urls[section.screenshot.index]}
                        alt={section.screenshot.description}
                        width={1200}
                        height={675}
                        loading="lazy"
                        className="mx-auto block h-auto w-full object-contain object-center"
                      />
                    </a>
                  </figure>
                )}

                {section.video && (
                  <figure className="my-8 --translate-x-0.4 sm:translate-x-0">
                    {videoUrl ? (
                      <div className="aspect-video overflow-hidden rounded-xl border border-color card-color2">
                        <iframe
                          src={videoUrl}
                          title={section.video.name}
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    ) : <p className="rounded-xl border border-color p-6 text-sm">This video is unavailable. Only YouTube videos are supported.</p>}
                  </figure>
                )}

                {section.subsections?.map((subsection) => (
                  <div key={subsection._id} className="mt-8">
                    <h3 id={subsection._id} tabIndex={-1}>{subsection.name}</h3>
                    {subsection.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </div>
                ))}
              </motion.section>
            ))}

            <div className="blog-article-end mt-12 flex flex-wrap items-center justify-between gap-5 pt-7">
              <Link href="/blog" className="blog-focus inline-flex cursor-pointer items-center gap-2 text-sm text-fill-color/70 hover:!text-blue-500">
                <FiArrowLeft aria-hidden="true" /> Back to the blog
              </Link>
              <Link href="/directory" className="blog-focus inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400">
                Explore repositories <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <BlogTableOfContents headings={headings} variant="desktop" />
        </div>
      </article>
      <BlogArticleControls headings={headings} />
    </main>
  );
}