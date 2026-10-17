import chatStarters from '../constants/chatStarters.json';

interface ChatStarterConfig {
  paths: string[];
  title: string;
  description: string;
  options: string[];
}

const contexts = chatStarters satisfies Record<string, ChatStarterConfig>;

export function getChatStarters(pathname: string | null): ChatStarterConfig {
  return Object.values(contexts).find((context) =>
    context.paths.some((path) => pathname === path || pathname?.startsWith(`${path}/`))
  ) ?? contexts.directory;
}