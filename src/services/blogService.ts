import blogs from '@/data/blogs.json';
import type { BlogPost } from '@/types/blog';

const posts: BlogPost[] = blogs;

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return posts;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | undefined> {
  return posts.find((post) => post.slug === slug);
}