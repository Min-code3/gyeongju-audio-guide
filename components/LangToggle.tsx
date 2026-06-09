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
    <div className="flex items-center gap-1 bg-white rounded-full px-1 py-1 shadow-sm border border-stone-100">
      <button
        onClick={() => toggle('ko')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          lang === 'ko' ? 'bg-amber-500 text-white' : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => toggle('en')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          lang === 'en' ? 'bg-amber-500 text-white' : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        English
      </button>
    </div>
  );
}

export default function LangToggle() {
  return (
    <Suspense fallback={<div className="h-8 w-32 rounded-full bg-stone-100 animate-pulse" />}>
      <LangToggleInner />
    </Suspense>
  );
}
