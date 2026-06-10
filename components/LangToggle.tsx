'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

export type Lang = 'ko' | 'en';

function LangToggleInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as Lang) ?? 'ko';

  const toggle = (next: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex items-center bg-stone-100 rounded-full p-0.5 text-xs font-medium">
      {/* sliding indicator */}
      <span
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: lang === 'en' ? 'translateX(calc(100% + 4px))' : 'translateX(2px)' }}
      />
      <button
        onClick={() => toggle('ko')}
        className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-200 ${lang === 'ko' ? 'text-stone-800' : 'text-stone-400'}`}
      >
        한국어
      </button>
      <button
        onClick={() => toggle('en')}
        className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-200 ${lang === 'en' ? 'text-stone-800' : 'text-stone-400'}`}
      >
        English
      </button>
    </div>
  );
}

export default function LangToggle() {
  return (
    <Suspense fallback={<div className="h-8 w-36 rounded-full bg-stone-100 animate-pulse" />}>
      <LangToggleInner />
    </Suspense>
  );
}
