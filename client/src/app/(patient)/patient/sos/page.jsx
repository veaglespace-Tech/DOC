'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientSOSPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/patient');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-xs font-bold text-slate-400">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
