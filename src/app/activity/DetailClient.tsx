'use client';

import Link from "next/link";

export default function DetailClient() {
  return (
    <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="text-center flex flex-col items-center max-w-[280px] sm:max-w-sm md:max-w-lg mx-auto mt-32 md:mt-32">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-500">/activity</h1>
       <p className="text-fill-color/70 mb-8 text-sm md:text-base leading-relaxed">
        This page is currently in development. It will display internal platform activity for our GitHub Repositories directory.
       </p>
        <Link href="/directory" className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20">
          Back to Directory
        </Link>
      </div>
    </main>
  );
}
