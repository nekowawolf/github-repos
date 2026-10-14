import { splitBlogLinks } from '@/lib/blogLinks';

export default function BlogText({ text }: { text: string }) {
  return splitBlogLinks(text).map((part, index) => part.href ? (
    <a
      key={index}
      href={part.href}
      target="_blank"
      rel="noopener noreferrer"
      className="blog-focus cursor-pointer text-blue-600 hover:underline underline-offset-4"
      aria-label={`${part.text} (opens in a new tab)`}
    >
      {part.text}
    </a>
  ) : part.text);
}