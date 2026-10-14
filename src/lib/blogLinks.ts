export type BlogTextPart = { text: string; href?: string };

const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

function getLinkUrl(value: string): string | null {
  try {
    if (value.includes('\\')) return null;
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    if (url.hostname.length > 253 || !DOMAIN.test(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function trimLinkPunctuation(value: string): string {
  let result = value;
  while (result) {
    if (/[.,!?;:]$/.test(result)) {
      result = result.slice(0, -1);
      continue;
    }
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    const closing = result.slice(-1);
    const opening = pairs[closing];
    if (opening && result.split(closing).length > result.split(opening).length) {
      result = result.slice(0, -1);
      continue;
    }
    break;
  }
  return result;
}

export function splitBlogLinks(text: string): BlogTextPart[] {
  const pattern = /https?:\/\/[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{1,5})?(?:[/?#][^\s<>"']*)?/gi;
  const parts: BlogTextPart[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    // Do not link fragments of email addresses, unsupported schemes, or other words.
    if (start > 0 && !/[\s([{]/.test(text[start - 1])) continue;
    const label = trimLinkPunctuation(match[0]);
    const href = getLinkUrl(label);
    if (!href) continue;

    if (start > cursor) parts.push({ text: text.slice(cursor, start) });
    parts.push({ text: label, href });
    cursor = start + label.length;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}