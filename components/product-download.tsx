"use client";

import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

const downloadUrl = '/api/download/product';

export function ProductDownload() {
  const [autoStarted, setAutoStarted] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (autoStarted) {
      return;
    }

    setAutoStarted(true);
    downloadLinkRef.current?.click();
  }, [autoStarted]);

  return (
    <div className="mt-8 space-y-4">
      <a ref={downloadLinkRef} href={downloadUrl} download className="hidden" aria-hidden="true">
        Download SELLDROX product
      </a>
      <a href={downloadUrl} download className="primary-btn mx-auto w-full max-w-sm gap-2">
        <Download className="h-4 w-4" />
        Download Product PDF
      </a>
      <p className="text-sm text-slate-300">
        Your download should start automatically. Use the button if it does not.
      </p>
    </div>
  );
}
