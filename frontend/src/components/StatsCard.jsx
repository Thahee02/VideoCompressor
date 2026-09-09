import React from 'react'
import { formatSize } from './ProgressBar'

export default function StatsCard({ originalSize, compressedSize, fileName }) {
  const savings = originalSize && compressedSize
    ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100)
    : 0

  const savedBytes = originalSize - compressedSize

  // Width percentages for comparison bar (compressed relative to original)
  const compressedBarWidth = originalSize
    ? Math.max(2, (compressedSize / originalSize) * 100)
    : 0

  return (
    <div className="slide-up">
      {/* Success badge */}
      <div className="result-hero">
        <div className="result-badge">
          <span>✅</span> Compression Complete
        </div>
        <h2 className="result-title">Your video is ready</h2>
        <div className="result-savings">{savings.toFixed(1)}%</div>
        <div className="result-savings-label">
          smaller — saved {formatSize(savedBytes)}
        </div>
      </div>

      {/* Size stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-label">Original Size</div>
          <div className="stat-card-value">
            {formatSizeNum(originalSize).value}
            <span className="stat-card-unit">{formatSizeNum(originalSize).unit}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Compressed Size</div>
          <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
            {formatSizeNum(compressedSize).value}
            <span className="stat-card-unit">{formatSizeNum(compressedSize).unit}</span>
          </div>
        </div>
      </div>

      {/* Visual comparison bar */}
      <div className="size-comparison">
        <div className="size-cmp-row">
          <span className="size-cmp-label">Original</span>
          <div className="size-cmp-bar">
            <div className="size-cmp-fill original" style={{ width: '100%' }} />
          </div>
          <span className="size-cmp-value">{formatSize(originalSize)}</span>
        </div>
        <div className="size-cmp-row">
          <span className="size-cmp-label">Compressed</span>
          <div className="size-cmp-bar">
            <div
              className="size-cmp-fill compressed"
              style={{ width: `${compressedBarWidth}%` }}
            />
          </div>
          <span className="size-cmp-value" style={{ color: 'var(--color-success)' }}>
            {formatSize(compressedSize)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatSizeNum(bytes) {
  if (!bytes && bytes !== 0) return { value: '—', unit: '' }
  if (bytes < 1024 * 1024) return { value: (bytes / 1024).toFixed(1), unit: 'KB' }
  if (bytes < 1024 * 1024 * 1024) return { value: (bytes / (1024 * 1024)).toFixed(2), unit: 'MB' }
  return { value: (bytes / (1024 * 1024 * 1024)).toFixed(2), unit: 'GB' }
}
