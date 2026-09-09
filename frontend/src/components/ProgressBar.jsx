import React from 'react'

const STATUS_LABELS = {
  pending: 'Preparing video file…',
  processing: 'Compressing video…',
  done: 'Compression complete!',
  failed: 'Compression error',
  cancelled: 'Cancelled',
}

export default function ProgressBar({ progress, status, fileName, originalSize, onCancel }) {
  const label = STATUS_LABELS[status] ?? 'Processing video…'
  const pct = Math.min(Math.max(progress ?? 0, 0), 100)

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#005A85]/10 text-[#005A85] flex items-center justify-center text-2xl shadow-sm">
            ⚡
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{label}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {status === 'processing'
                ? 'Optimizing video size while preserving visual quality...'
                : status === 'pending'
                ? 'Reading file stream...'
                : label}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">File:</span>
          <span className="text-xs font-bold text-slate-800 truncate max-w-[160px]">{fileName}</span>
          <span className="text-xs font-semibold text-[#005A85] bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            {formatSize(originalSize)}
          </span>
        </div>
      </div>

      {/* 🎬 COMPACT SINGLE VIDEO FRAME — TOP TO BOTTOM REVEAL ANIMATION */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 max-w-md mx-auto">
          <span>Video Reveal Progress</span>
          <span className="text-[#005A85] font-mono text-sm">{pct}% Complete</span>
        </div>

        {/* Compact Centered Video Frame Container */}
        <div className="relative w-full max-w-md mx-auto aspect-[16/9] h-48 sm:h-56 bg-slate-950 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-xl group">
          
          {/* Base Unprocessed Video Frame Background */}
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-700 space-y-1">
            <span className="text-4xl opacity-40">🎬</span>
            <span className="text-[11px] font-mono tracking-widest uppercase opacity-40">Encoding Video Stream</span>
          </div>

          {/* Top-to-Bottom Revealed Video Layer */}
          <div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#005A85] via-blue-700 to-indigo-800 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-white"
            style={{ height: `${pct}%` }}
          >
            <div className="flex flex-col items-center justify-center space-y-1 p-3">
              <span className="text-3xl drop-shadow-md">✨</span>
              <span className="text-xs font-extrabold tracking-wider text-blue-100 uppercase">Revealed Frame</span>
            </div>
          </div>

          {/* Glowing Top-to-Bottom Laser Scanning Line */}
          {pct > 0 && pct < 100 && (
            <div
              className="absolute inset-x-0 h-1 bg-cyan-300 shadow-[0_0_12px_#005A85] z-20 transition-all duration-300"
              style={{ top: `calc(${pct}% - 2px)` }}
            >
              <div className="w-full h-full bg-white opacity-90 animate-pulse"></div>
            </div>
          )}

          {/* Center Overlay Stats */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-mono font-extrabold text-base shadow-lg">
              {pct}%
            </div>
          </div>

        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-xl mx-auto">
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#005A85] to-blue-600 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Processing video stream...</span>
          <span>{pct < 100 ? 'Estimating remaining time...' : 'Finalizing video file...'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {(status === 'pending' || status === 'processing') && (
        <div className="pt-2 flex justify-center">
          <button
            id="cancel-btn"
            onClick={onCancel}
            type="button"
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <span>✕</span> Cancel Compression
          </button>
        </div>
      )}

    </div>
  )
}

export function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}
