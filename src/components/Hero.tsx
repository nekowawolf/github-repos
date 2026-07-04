import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 mt-20">
      <div className="mb-8">
        <Image
          src="https://sernine.com/assets/b8a338935c4b71405b86352a330bbbc41832b315-CVTbyZJ_.png"
          alt="Under Construction"
          width={200}
          height={200}
          className="w-48 sm:w-64 md:w-80 h-auto drop-shadow-2xl animate-pulse"
          unoptimized
        />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-blue-400 drop-shadow-sm tracking-tight">
        This page is under construction
      </h1>
      <p className="text-fill-color/80 max-w-lg mt-2 mb-8 font-medium leading-relaxed">
        This landing page is currently under development. Please proceed directly to our directory to explore the content.
      </p>
      <Link href="/directory" className="cursor-pointer inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5">
        Explore Directory
      </Link>
    </div>
  );
}