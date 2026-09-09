import React from 'react'

const STATUS_LABELS = {
  pending:    'Queued…',
  processing: 'Compressing…',
  done:       'Done!',
  failed:     'Failed',
  cancelled:  'Cancelled',
}

export default function ProgressBar({ progress, status, fileName, originalSize, onCancel }) {
  const label = STATUS_LABELS[status] ?? 'Processing…'
  const pct = Math.min(Math.max(progress ?? 0, 0), 100)

  return (
    <div className="progress-section fade-in">
      <div className="progress-header">
        <div className="progress-icon-wrap">🔧</div>
        <div>
          <div className="progress-title">{label}</div>
          <div className="progress-subtitle">
            {status === 'processing'
              ? 'Running FFmpeg in the background…'
              : status === 'pending'
              ? 'Waiting to start…'
              : label}
          </div>
        </div>
      </div>

      {/* File info */}
      <div className="file-info-strip">
        <span className="file-info-icon">📹</span>
        <span className="file-info-name">{fileName}</span>
        <span className="file-info-size">{formatSize(originalSize)}</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="progress-labels">
        <span>{pct}%</span>
        <span>{pct < 100 ? 'Estimating remaining time…' : 'Finalizing…'}</span>
      </div>

      {/* Cancel */}
      {(status === 'pending' || status === 'processing') && (
        <div style={{ textAlign: 'center' }}>
          <button
            id="cancel-btn"
            className="btn btn-danger"
            onClick={onCancel}
            type="button"
          >
            ✕ Cancel
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
