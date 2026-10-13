import type { ReactNode } from 'react';
import { FallbackImage } from '@/components/common/FallbackImage';
import { formatBlogDate } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';

export default function BlogAuthor({ post, variant = 'card', actions }: { post: BlogPost; variant?: 'card' | 'article'; actions?: ReactNode }) {
  const isArticle = variant === 'article';

  if (isArticle) return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-fill-color/60 sm:gap-3">
      <a href={post.added_by.url} target="_blank" rel="noopener noreferrer" aria-label={post.added_by.name} className="blog-focus shrink-0 cursor-pointer rounded-full">
        <FallbackImage src={post.added_by.image_url} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
      </a>
      <div className="flex min-w-0 flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
        <a href={post.added_by.url} target="_blank" rel="noopener noreferrer" className="blog-focus min-w-0 cursor-pointer truncate font-medium text-fill-color hover:!text-blue-500">{post.added_by.name}</a>
        <span aria-hidden="true" className="hidden lg:inline">·</span>
        <time dateTime={post.created_at} className="whitespace-nowrap text-[11px] sm:text-xs lg:text-sm">{formatBlogDate(post.created_at)}</time>
      </div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">{actions}</div>}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fill-color/60">
      <a href={post.added_by.url} target="_blank" rel="noopener noreferrer" className="blog-focus inline-flex cursor-pointer items-center gap-2 hover:!text-blue-500">
        <FallbackImage
          src={post.added_by.image_url}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 rounded-full object-cover"
        />
        <span>{post.added_by.name}</span>
      </a>
      <span aria-hidden="true">·</span>
      <time dateTime={post.created_at}>{formatBlogDate(post.created_at)}</time>
    </div>
  );
}