import React from 'react';

export default function DashboardFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-4 px-6 sm:px-8">
      <div className="mx-auto flex items-center justify-center text-xs text-slate-500 font-medium">
        <p className="text-center">
          Designed &amp; Developed by{' '}
          <a 
            href="https://veaglespace.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            Veagle Space Technology Pvt. Ltd.
          </a>{' '}
          | &copy; 2026 All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
