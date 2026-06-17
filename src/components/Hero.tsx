import Image from "next/image";

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
      <p className="text-fill-color/70 max-w-lg mt-2 font-medium">
       Buat aja dulu gpp hasilnya jelek nanti bisa di bagusin, yang penting production karena klo nunggu bagus gk akan pernah production
      </p>
    </div>
  );
}