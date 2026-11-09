import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full bg-white border-b border-blue-100 py-4 lg:py-6 shadow-sm z-40 relative">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
        
        {/* Left: Original School Logo */}
        <Link href="/" className="shrink-0 flex items-center transition-transform hover:scale-105 duration-300">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 md:border-4 border-blue-800 bg-slate-50 shadow-[0_0_15px_rgba(30,58,138,0.2)]">
            <Image
              src="/images/school-logo.jpg"
              alt="Paramakudi Lions School Logo"
              fill
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 112px"
              className="object-contain scale-[0.93]"
              priority
            />
          </div>
        </Link>

        {/* Center: Prominent School Name */}
        <div className="text-center px-1 mx-4 sm:mx-8">
          <h1 className="font-extrabold text-blue-900 text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tight leading-tight drop-shadow-sm uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            Paramakudi <span className="text-yellow-600 drop-shadow-sm">Lions</span>
          </h1>
          <p className="text-[10px] sm:text-sm md:text-base lg:text-lg text-slate-600 font-extrabold tracking-widest mt-1 md:mt-2 uppercase bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
            Matriculation Higher Secondary School
          </p>
        </div>

        {/* Right: Lions Club Logo */}
        <div className="shrink-0 flex items-center transition-transform hover:scale-105 duration-300">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 md:border-4 border-yellow-500 bg-white shadow-[0_0_15px_rgba(234,179,8,0.2)] p-1">
             {/* Using the same logo temporarily, ideally replace with exact Lions Club logo later */}
            <Image
              src="/images/logo.jpg"
              alt="Lions Club Logo"
              fill
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 112px"
              className="object-contain scale-[0.93]"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}
