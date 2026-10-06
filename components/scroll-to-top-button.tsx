"use client";

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 420);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-900 shadow-[0_18px_44px_rgba(15,23,42,0.14)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300/60 dark:border-white/15 dark:bg-slate-950/80 dark:text-white dark:shadow-[0_18px_44px_rgba(2,6,23,0.45)] dark:hover:border-blue-300/40 dark:hover:bg-blue-500/20 md:bottom-7 md:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
