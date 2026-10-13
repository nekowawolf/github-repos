'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FiArrowDown, FiCheck, FiChevronDown } from 'react-icons/fi';
import type { BlogSort } from '@/types/blog';

const options: { value: BlogSort; label: string }[] = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export default function BlogSortDropdown({ value, onChange }: { value: BlogSort; onChange: (value: BlogSort) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const isActive = isOpen || value !== 'latest';

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block shrink-0 text-left"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        id="blog-sort"
        type="button"
        aria-label={`Sort articles: ${options.find((option) => option.value === value)?.label}`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className={`blog-focus flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-500/20 text-fill-color border border-blue-500/50' : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'}`}
      >
        <FiArrowDown aria-hidden="true" className={`h-4 w-4 ${isActive ? 'text-blue-400' : ''}`} />
        <span className="whitespace-nowrap">{options.find((option) => option.value === value)?.label}</span>
        <FiChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id={panelId} role="group" aria-label="Sort order" className="absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-color card-color shadow-xl">
          <div className="px-3 pb-3 pt-5">
            <div className="mb-2 flex items-center gap-1.5 px-2 text-fill-color/60">
              <FiArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
              <p className="text-xs font-semibold uppercase tracking-wider">Sort by</p>
            </div>
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={value === option.value}
                  onClick={() => { onChange(option.value); setIsOpen(false); triggerRef.current?.focus(); }}
                  className={`blog-focus flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${value === option.value ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'}`}
                >
                  <span>{option.label}</span>
                  {value === option.value && <FiCheck aria-hidden="true" className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}