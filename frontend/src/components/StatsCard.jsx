import React from 'react'
import { formatSize } from './ProgressBar'

export default function StatsCard({ originalSize, compressedSize, fileName }) {
  const savings = originalSize && compressedSize
    ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100)
    : 0

  const savedBytes = Math.max(0, originalSize - compressedSize)

  const compressedBarWidth = originalSize
    ? Math.max(5, (compressedSize / originalSize) * 100)
    : 0

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 p-6 sm:p-8 text-center shadow-sm">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          {savings.toFixed(1)}% Smaller File
        </h2>
        
        <p className="text-base sm:text-lg text-slate-600">
          You saved <span className="font-bold text-emerald-700">{formatSize(savedBytes)}</span> of storage space while keeping full video quality.
        </p>
      </div>

      {/* Size Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Original */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Size</div>
          <div className="text-3xl font-black text-slate-800 font-mono">
            {formatSize(originalSize)}
          </div>
          <div className="text-sm text-slate-500">Before compression</div>
        </div>

        {/* Compressed */}
        <div className="p-6 rounded-2xl bg-white border border-emerald-300 space-y-1 shadow-xs ring-2 ring-emerald-500/10">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">New Size</div>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {formatSize(compressedSize)}
          </div>
          <div className="text-sm text-emerald-700 font-medium">Ready for download</div>
        </div>

      </div>

      {/* Comparison Progress Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Visual Size Reduction
        </h4>

        <div className="space-y-4">
          {/* Original Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-slate-600 font-semibold">
              <span>Original File</span>
              <span>{formatSize(originalSize)}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
              <div className="h-full bg-slate-400 rounded-md w-full"></div>
            </div>
          </div>

          {/* Compressed Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-emerald-700">Compressed File</span>
              <span className="text-emerald-700 font-bold">{formatSize(compressedSize)}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md transition-all duration-700 shadow-xs"
                style={{ width: `${compressedBarWidth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
