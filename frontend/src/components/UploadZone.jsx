import React, { useRef, useState, useCallback } from 'react'

const PRESETS = [
  {
    id: 'balanced',
    emoji: '⚡',
    name: 'Balanced Compression',
    tag: 'Recommended',
    desc: 'Great balance of small file size and clear video quality.',
    saving: 'Saves ~50% space',
  },
  {
    id: 'high_compression',
    emoji: '🗜️',
    name: 'Maximum Savings',
    tag: 'Smallest File',
    desc: 'Reduces file size as much as possible for quick sharing.',
    saving: 'Saves up to 75% space',
  },
  {
    id: 'lossless',
    emoji: '💎',
    name: 'High Quality',
    tag: 'Best Detail',
    desc: 'Keeps maximum sharpness and full video clarity.',
    saving: 'Saves ~30% space',
  },
]

const ACCEPTED = '.mp4,.mkv,.mov,.avi,.webm,.flv,.wmv,.m4v'

export default function UploadZone({ onUpload, disabled }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [preset, setPreset] = useState('balanced')

  const handleFile = useCallback(
    (file) => {
      if (!file || disabled) return
      onUpload(file, preset)
    },
    [onUpload, preset, disabled]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      handleFile(file)
    },
    [handleFile]
  )

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)
  const onInputChange = (e) => handleFile(e.target.files?.[0])

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* SECTION 1: DRAG & DROP UPLOAD AREA (FIRST) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Upload Video File
        </span>

        <div
          id="upload-zone"
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          tabIndex={0}
          aria-label="Upload video file"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={`w-full rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-[#005A85] bg-blue-50/60 shadow-lg scale-[1.005]'
              : 'border-slate-300 bg-white hover:border-[#005A85] hover:bg-blue-50/20 shadow-sm'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            id="video-file-input"
            accept={ACCEPTED}
            className="hidden"
            onChange={onInputChange}
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-[#005A85]/10 text-[#005A85] flex items-center justify-center text-4xl shadow-inner">
              🎬
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {dragOver ? 'Drop file to start compressing!' : 'Drag & drop your video here'}
              </h3>
              <p className="text-base text-slate-500">
                or <span className="text-[#005A85] font-bold underline underline-offset-4">choose file</span> from your computer
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {['MP4', 'MOV', 'MKV', 'AVI', 'WEBM'].map((fmt) => (
                <span key={fmt} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {fmt}
                </span>
              ))}
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Up to 2 GB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHOOSE COMPRESSION LEVEL (BELOW UPLOAD AREA) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Choose Compression Level
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESETS.map((p) => {
            const isSelected = preset === p.id
            return (
              <button
                key={p.id}
                id={`preset-${p.id}`}
                onClick={() => setPreset(p.id)}
                type="button"
                className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#005A85] shadow-md ring-2 ring-[#005A85]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                    isSelected ? 'bg-[#005A85] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.tag}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{p.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{p.desc}</p>
                <span className="text-xs font-semibold text-[#005A85] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {p.saving}
                </span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
