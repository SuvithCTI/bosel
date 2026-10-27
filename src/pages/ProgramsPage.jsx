import React from 'react';

export default function ProgramsPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50 py-12 md:py-16">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 text-center min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Academic & Skill Programs
          </span>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-slate-900">
            Programs By Vinodini 
          </h1>
          <p className="text-slate-500 text-sm max-w-md">
            This page is currently being prepared. Content will be added here soon.
          </p>
        </div>
      </div>
    </div>
  );
}
