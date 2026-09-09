import React from 'react'
import UploadZone from '../components/UploadZone'
import ProgressBar from '../components/ProgressBar'
import StatsCard from '../components/StatsCard'

const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'

export default function Home({
  step,
  jobData,
  fileName,
  originalSize,
  error,
  uploading,
  handleUpload,
  handleCancel,
  handleDownload,
  resetToUpload
}) {
  return (
    <div className="w-full space-y-16 pb-20">
      
      {/* ── HERO SECTION (FULL SCREEN HEIGHT, LEFT TEXT / RIGHT UNSPLASH IMAGE) ── */}
      <section className="w-full min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT SIDE: TEXT CONTENT */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Compress Videos Fast.{' '}
                <span className="text-[#005A85]">
                  Zero Quality Loss.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Reduce MP4, MOV, MKV, and AVI video file sizes easily. Perfect for email attachments, web publishing, social media, and saving storage space.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#compressor-tool"
                  className="px-8 py-4 rounded-2xl bg-[#005A85] hover:bg-[#004a6e] text-white font-bold text-base shadow-lg shadow-[#005A85]/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Start Compressing
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: UNSPLASH REAL PHOTOGRAPHY IMAGE */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white group">
                <img
                  src={HERO_IMAGE_URL}
                  alt="Professional Video Editing and Production Setup"
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN COMPRESSOR WORKSPACE (FULL WIDTH, SMALL PADDING) ── */}
      <section id="compressor-tool" className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4">
        <div className="w-full rounded-3xl bg-white border border-slate-200 p-6 sm:p-12 shadow-xl shadow-slate-200/60">
          
          {/* UPLOAD STEP */}
          {step === 'upload' && (
            <UploadZone
              onUpload={handleUpload}
              disabled={uploading}
            />
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <ProgressBar
              progress={jobData?.progress ?? 0}
              status={jobData?.status ?? 'pending'}
              fileName={fileName}
              originalSize={originalSize}
              onCancel={handleCancel}
            />
          )}

          {/* DONE STEP */}
          {step === 'done' && jobData && (
            <div className="space-y-8">
              <StatsCard
                originalSize={jobData.original_size}
                compressedSize={jobData.compressed_size}
                fileName={fileName}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-200">
                <button
                  id="download-btn"
                  onClick={handleDownload}
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">⬇️</span> Download Compressed Video
                </button>

                <button
                  id="compress-another-btn"
                  onClick={resetToUpload}
                  type="button"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔁</span> Compress Another Video
                </button>
              </div>
            </div>
          )}

          {/* ERROR STEP */}
          {step === 'error' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 text-3xl flex items-center justify-center mx-auto border border-red-200">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Compression Failed</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">{error || 'Something went wrong while processing the video.'}</p>
              </div>
              <button
                id="try-again-btn"
                onClick={resetToUpload}
                type="button"
                className="px-8 py-3 rounded-xl bg-[#005A85] hover:bg-[#00496b] text-white font-bold text-sm transition-all shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── FEATURES GRID (FULL WIDTH) ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose VideoPress?
          </h2>
          <p className="text-sm text-slate-500">
            Simple, fast, and privacy-focused video processing for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005A85] flex items-center justify-center text-2xl font-bold">
              🔒
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Private</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your video is processed securely in memory and never stored on any database or hard drive.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-slate-900">Fast & Free</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No account creation or subscription required. Upload your file and get your compressed video in seconds.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900">Smart Quality Control</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reduces video file size up to 75% while keeping colors sharp and playback smooth.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
