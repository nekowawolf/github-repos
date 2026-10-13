'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiList, FiX } from 'react-icons/fi';
import type { BlogHeading } from '@/types/blog';

function ContentsLinks({ headings, activeId }: { headings: BlogHeading[]; activeId: string }) {
  const indicatorId = useId();
  const reducedMotion = useReducedMotion();

  return (
    <ol className="space-y-0.5">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? 'location' : undefined}
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open');
              document.getElementById(heading.id)?.focus({ preventScroll: true });
            }}
            className={`blog-focus blog-toc-link relative block cursor-pointer py-1.5 pr-2 leading-5 ${heading.level === 3 ? 'pl-7 text-xs' : 'pl-4 text-sm'}`}
          >
            {activeId === heading.id && (
              <motion.span
                layoutId={indicatorId}
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
                className="absolute bottom-1 left-0 top-1 w-0.5 rounded-full bg-blue-500"
                aria-hidden="true"
              />
            )}
            {heading.name}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function BlogTableOfContents({ headings, variant = 'mobile' }: { headings: BlogHeading[]; variant?: 'mobile' | 'desktop' }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const details = detailsRef.current;
      if (details?.open && !details.contains(event.target as Node)) details.open = false;
    }
    function closeOnEscape(event: KeyboardEvent) {
      const details = detailsRef.current;
      if (event.key === 'Escape' && details?.open) {
        details.open = false;
        details.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateActiveHeading = () => {
      frame = 0;
      let current = headings[0]?.id ?? '';
      const anchorLine = 152;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= anchorLine) current = heading.id;
      }
      setActiveId(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveHeading);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, [headings]);

  return (
    <aside className={variant === 'desktop' ? 'hidden lg:sticky lg:top-28 lg:block lg:self-start' : 'lg:hidden'}>
      {variant === 'desktop' ? (
        <nav aria-label="On this page" className="max-h-[calc(100dvh-9rem)] overflow-y-auto py-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-fill-color/60">On this page</p>
          <div className="blog-toc-track">
            <ContentsLinks headings={headings} activeId={activeId} />
          </div>
        </nav>
      ) : (
        <details
          ref={detailsRef}
          className="group relative"
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
        >
          <summary title="On this page" className="blog-focus flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-500 [&::-webkit-details-marker]:hidden">
            <FiList aria-hidden="true" className="h-5 w-5 group-open:hidden" />
            <FiX aria-hidden="true" className="hidden h-5 w-5 group-open:block" />
            <span className="sr-only">On this page</span>
          </summary>
          <nav aria-label="On this page" className="absolute bottom-full right-0 mb-3 max-h-[calc(100dvh-16rem)] w-[min(18rem,calc(100vw-3.5rem))] overflow-y-auto rounded-xl border border-color card-color p-3 shadow-xl">
            <p className="mb-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fill-color/60">On this page</p>
            <ContentsLinks headings={headings} activeId={activeId} />
          </nav>
        </details>
      )}
    </aside>
  );
}