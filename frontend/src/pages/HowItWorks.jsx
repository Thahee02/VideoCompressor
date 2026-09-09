import React from 'react'
import { Link } from 'react-router-dom'

export default function HowItWorks() {
  return (
    <div className="w-full space-y-16 pb-20 animate-fadeIn">
      
      {/* ── TALL HERO HEADER SECTION ── */}
      <section className="w-full min-h-[55vh] flex items-center bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200/80 py-20 sm:py-28 text-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How <span className="text-[#005A85]">VideoPress</span> Works
          </h1>
          <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Compressing large videos for email, websites, or social media is fast and easy. Follow these 3 simple steps.
          </p>
        </div>
      </section>

      {/* ── STEPS GRID ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#005A85] text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
              1
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Upload Your Video File</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Drag & drop your video file (MP4, MOV, MKV, AVI, etc.) into the upload box. Up to 2 GB per file supported.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#005A85] text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
              2
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Select Compression Level</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Choose between <strong>Balanced</strong> (recommended), <strong>Maximum Savings</strong> (smallest file), or <strong>High Quality</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#005A85] text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
              3
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Download Compressed Video</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                As soon as compression finishes, click <strong>Download</strong>. Your original video data is erased from memory immediately.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-[#005A85] text-white p-10 sm:p-16 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold">Ready to reduce your video size?</h2>
          <p className="text-blue-100 text-lg max-w-lg mx-auto">
            No installation or sign-up required. Free forever.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block px-10 py-4 rounded-2xl bg-white text-[#005A85] font-extrabold text-lg shadow-md hover:bg-blue-50 transition-all hover:scale-105"
            >
              Compress a Video Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
