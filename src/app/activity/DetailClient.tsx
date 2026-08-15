'use client';

import NwwOneeAIChat from "@/components/NwwOneeAIChat";
import LastRepos from "@/components/LastRepos";
import LastCommits from "@/components/LastCommits";
import StatsHistory from "@/components/StatsHistory";
import Support from "@/components/Support";

export default function DetailClient() {
  return (
    <main className="flex-grow pt-36 pb-16 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col">
        <LastRepos />
        <StatsHistory />
        <Support />
        <LastCommits />
      </div>
      <NwwOneeAIChat />
    </main>
  );
}