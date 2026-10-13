export interface BlogSubsection {
  _id: string;
  name: string;
  paragraphs: string[];
}

export interface BlogSection {
  _id: string;
  name: string;
  paragraphs: string[];
  subsections?: BlogSubsection[];
  screenshot?: {
    index: number;
    description: string;
  };
  video?: {
    name: string;
    description: string;
  };
}

export interface BlogPost {
  _id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  categories: string[];
  media: {
    screenshot_urls: string[];
    video_url: string;
  };
  added_by: {
    name: string;
    url: string;
    image_url: string;
  };
  created_at: string;
  content: BlogSection[];
}

export type BlogSort = 'latest' | 'oldest';

export interface BlogHeading {
  id: string;
  name: string;
  level: 2 | 3;
}