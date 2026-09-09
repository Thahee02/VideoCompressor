import React from 'react'

export default function About() {
  return (
    <div className="w-full space-y-16 pb-20 animate-fadeIn">
      
      {/* ── TALL HERO HEADER SECTION ── */}
      <section className="w-full min-h-[55vh] flex items-center bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200/80 py-20 sm:py-28 text-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Privacy-First <span className="text-[#005A85]">Video Optimization</span>
          </h1>
          <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            We built VideoPress to give creators, businesses, and everyday users a fast, free, and secure way to reduce video file sizes online.
          </p>
        </div>
      </section>

      {/* ── MISSION CARD ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Our Privacy Commitment</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Unlike ordinary file conversion tools that store your personal media on permanent servers, <strong>VideoPress operates entirely in temporary memory</strong>. 
          </p>
          <p className="text-slate-600 text-lg leading-relaxed">
            Your video files are never written to hard drives or stored in a database. Once you download your video, refresh your browser, or cancel the upload, your video data is permanently erased.
          </p>
        </div>
      </section>

      {/* ── KEY ADVANTAGES GRID ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005A85] flex items-center justify-center text-3xl font-bold">
              🛡️
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Zero Storage</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Your files remain 100% private. No permanent copies or logs are created.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005A85] flex items-center justify-center text-3xl font-bold">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Instant Processing</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Engineered for speed so you can get your compressed video without waiting.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005A85] flex items-center justify-center text-3xl font-bold">
              💼
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Business Ready</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Ideal for sending videos via email, messaging apps, and client presentations.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
