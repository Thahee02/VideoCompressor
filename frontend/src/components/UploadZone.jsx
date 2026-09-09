import React, { useRef, useState, useCallback } from 'react'

const PRESETS = [
  {
    id: 'balanced',
    emoji: '⚡',
    name: 'Balanced',
    desc: 'H.264 · CRF 23 · 40–60% smaller',
  },
  {
    id: 'high_compression',
    emoji: '🗜️',
    name: 'Max Compress',
    desc: 'H.265 · CRF 28 · 60–75% smaller',
  },
  {
    id: 'lossless',
    emoji: '💎',
    name: 'Lossless',
    desc: 'H.264 · CRF 18 · near-zero loss',
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
    <div className="slide-up">
      {/* Drop zone */}
      <div
        id="upload-zone"
        className={`upload-zone glass-card ${dragOver ? 'drag-over' : ''}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Upload video file"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          id="video-file-input"
          accept={ACCEPTED}
          style={{ display: 'none' }}
          onChange={onInputChange}
        />

        <div className="upload-icon-wrap">
          <span className="upload-icon">🎬</span>
        </div>

        <h2 className="upload-title">
          {dragOver ? 'Drop it here!' : 'Drop your video here'}
        </h2>
        <p className="upload-subtitle">
          or click to browse · up to 2 GB
        </p>

        <div className="upload-formats">
          {['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'FLV', 'WMV'].map((f) => (
            <span key={f} className="format-badge">{f}</span>
          ))}
        </div>
      </div>

      {/* Preset selector */}
      <div className="preset-section">
        <p className="preset-label">Compression Preset</p>
        <div className="preset-grid">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              id={`preset-${p.id}`}
              className={`preset-card ${preset === p.id ? 'active' : ''}`}
              onClick={() => setPreset(p.id)}
              type="button"
            >
              <span className="preset-emoji">{p.emoji}</span>
              <span className="preset-name">{p.name}</span>
              <span className="preset-desc">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
