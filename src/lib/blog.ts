import type { BlogHeading, BlogPost, BlogSort } from '@/types/blog';

export const BLOG_POSTS_PER_PAGE = 4;

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function filterBlogPosts(posts: BlogPost[], query: string, sort: BlogSort): BlogPost[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return posts.filter((post) => {
    const searchable = [post.name, post.description, post.added_by.name, ...post.categories]
      .join(' ').toLowerCase();
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => {
    const difference = Date.parse(a.created_at) - Date.parse(b.created_at);
    return sort === 'oldest' ? difference : -difference;
  });
}

export function getBlogHeadings(post: BlogPost): BlogHeading[] {
  return post.content.flatMap((section) => [
    { id: section._id, name: section.name, level: 2 as const },
    ...(section.subsections ?? []).map((subsection) => ({
      id: subsection._id, name: subsection.name, level: 3 as const,
    })),
  ]);
}

export function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;

    if (host === 'youtu.be') {
      id = url.pathname.slice(1);
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})\/?$/)?.[1] ?? null;
    } else if (host === 'www.youtube-nocookie.com') {
      id = url.pathname.match(/^\/embed\/([\w-]{11})\/?$/)?.[1] ?? null;
    }

    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}