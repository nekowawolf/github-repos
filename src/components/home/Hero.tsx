import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 mt-10 md:mt-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-500">
        /landing-page
      </h1>
      <p className="text-fill-color/70 max-w-[320px] md:max-w-lg mt-2 mb-8 text-sm md:text-base leading-relaxed">
        This landing page is currently under development. Please proceed directly to our directory to explore the content.
      </p>
      <Link href="/directory" className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5">
        Explore Directory
      </Link>
    </div>
  );
}