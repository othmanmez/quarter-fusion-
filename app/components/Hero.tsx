import Image from 'next/image';

export default function Hero() {
  return (
    <section className="h-[400px] bg-black flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo centré */}
        <div className="flex items-center justify-center h-full">
          <div className="relative w-64 h-32 md:w-80 md:h-40">
            <Image
              src="/logo-snack.png"
              alt="Quarter Fusion - Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 256px, 320px"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 