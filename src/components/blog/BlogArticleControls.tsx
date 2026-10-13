'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { IoIosArrowUp } from 'react-icons/io';
import NwwOneeAIChat, { chatStore } from '@/components/chat/NwwOneeAIChat';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import type { BlogHeading } from '@/types/blog';

export default function BlogArticleControls({ headings }: { headings: BlogHeading[] }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const reducedMotion = useReducedMotion();
  const isChatOpen = useSyncExternalStore(
    chatStore.subscribe,
    () => chatStore.getSnapshot().isOpen,
    () => false,
  );

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 1500);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {!isChatOpen && (
        <div className="fixed bottom-24 right-7 z-40 flex flex-col items-end gap-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })}
            disabled={!showScrollTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            className={`blog-focus flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-500 motion-reduce:transition-none disabled:cursor-not-allowed ${showScrollTop ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-10 opacity-0'}`}
          >
            <IoIosArrowUp aria-hidden="true" className="h-6 w-6" />
          </button>
          <BlogTableOfContents headings={headings} variant="mobile" />
        </div>
      )}
      <NwwOneeAIChat />
    </>
  );
}