'use client';

import Link from "next/link";
import NwwOneeAIChat from "@/components/NwwOneeAIChat";

export default function DetailClient() {
  return (
    <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="flex flex-col items-center text-center mx-auto mt-32 md:mt-32">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-500">/news</h1>
       <p className="text-fill-color/70 max-w-[320px] md:max-w-lg mt-2 mb-8 text-sm md:text-base leading-relaxed">
          This page is currently in development. It will feature the latest news, updates, and feature releases regarding open-source repositories and development.
       </p>
        <Link href="/directory" className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5">
          Back to Directory
        </Link>
      </div>
      <NwwOneeAIChat />
    </main>
  );
}
