import type { BlogPost } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function blogRequest(path = ''): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/githubblog${path}`, {
    cache: 'no-store',
  });

  if (!response.ok && !(path && response.status === 404)) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || `Failed to fetch GitHub blogs (${response.status})`);
  }

  return response;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await blogRequest();
  const result = await response.json();
  const posts = Array.isArray(result) ? result : result?.data;

  if (!Array.isArray(posts)) {
    throw new Error('Invalid GitHub blogs response');
  }

  return posts;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | undefined> {
  const response = await blogRequest(`/slug/${encodeURIComponent(slug)}`);
  if (response.status === 404) return undefined;

  return response.json();
}