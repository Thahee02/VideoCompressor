# VideoPress — In-Memory Smart Video Compressor 🎬⚡

VideoPress is a high-performance, privacy-first web application designed to reduce video file sizes significantly without perceptual quality loss. 

Unlike traditional services, **VideoPress never writes uploaded or compressed videos to hard disks or databases.** Videos are processed pure in server RAM (`io.BytesIO`) using **FFmpeg CRF rate control** and streaming responses, giving users instant, secure compression.

---

## ✨ Features

- 🧠 **Pure In-Memory Processing**: Videos are read, encoded, and downloaded directly through RAM buffers (`io.BytesIO`). Zero database storage or hard disk persistence.
- ⚡ **No Quality Loss (CRF Encoding)**: Employs Constant Rate Factor rate control (H.264 / H.265 HEVC) for perceptual quality preservation with up to 75% size reduction.
- 🎞️ **Film-Strip Reveal Animation**: Real-time progress updates with an interactive video-frame reveal animation during encoding.
- 🔒 **Privacy First & Instant Purge**: Cancelling, refreshing the browser, or completing downloads immediately purges memory streams. Automatic background TTL sweeper removes idle memory jobs after 10 minutes.
- 🎨 **Modern Responsive UI**: Built with React 18, Vite, and Tailwind CSS v3 featuring dark mode aesthetics, glassmorphism cards, and multi-page routing.

---

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **Django 5.0** & **Django REST Framework**
- **FFmpeg** & `ffmpeg-python` (Adaptive x264/x265 rate control)
- **python-decouple** (Environment configuration)
- **django-cors-headers** (CORS management)

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v3** + **PostCSS** + **Autoprefixer**
- **React Router v6** (Multi-page client routing: Home, About, Contact)
- **Axios** (Multipart upload & blob streaming)

---

## 📂 Project Structure

```
VideoCompressor/
├── backend/
│   ├── backend/               # Django project settings & URLs
│   │   ├── settings.py
│   │   └── urls.py
│   ├── compressor/            # Compressor app
│   │   ├── job_store.py       # In-memory job registry & TTL background thread
│   │   ├── views.py           # Upload, status, cancel, download REST endpoints
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                   # (Git-ignored) Backend secrets
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar with active route indicators
│   │   │   ├── Footer.jsx     # Footer & tech stack breakdown
│   │   │   ├── UploadZone.jsx # Drag-and-drop zone & quality preset picker
│   │   │   ├── ProgressBar.jsx# Video reveal film-strip animation
│   │   │   └── StatsCard.jsx  # Before/after comparison & download action
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Hero section & compressor engine workspace
│   │   │   ├── About.jsx      # Technical architecture & memory lifecycle
│   │   │   └── Contact.jsx    # Support form & interactive FAQ accordion
│   │   ├── App.jsx            # React Router setup & global state manager
│   │   ├── index.css          # Tailwind CSS directives & custom keyframes
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env                   # (Git-ignored) Vite env variables
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **FFmpeg** installed and accessible in your system `PATH` (or provided via `imageio-ffmpeg`).

---

### 1. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create & activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run database migrations (sessions & admin defaults)
python manage.py migrate

# Start the Django development server
python manage.py runserver 8000
```

The backend server will run at `http://localhost:8000`.

---

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:5173`. Open your browser to start compressing videos!

---

## 🗜️ Preset Specifications

| Preset | Codec | Rate Control | Estimated Savings | Best For |
|---|---|---|---|---|
| **Balanced** | H.264 | CRF 23 | 40% – 60% | General videos, social media |
| **Max Compress** | H.265 (HEVC) | CRF 28 | 60% – 75% | Storage saving & large files |
| **Visually Lossless** | H.264 | CRF 18 | 20% – 40% | Archival & high quality edits |

---

## 🔒 Memory Safety & Security

1. **Streaming Multi-part Engine**: Files stream into memory buffers; no temporary file is left behind on disk.
2. **Instant Cancellation Hook**: Clicking **Cancel** or closing the browser tab sends an explicit `DELETE /api/cancel/<job_id>/` call to instantly abort FFmpeg sub-processes and discard RAM buffers.
3. **Automated Background Sweeper**: A lightweight daemon thread checks memory jobs every 60 seconds and evicts any un-downloaded job older than 10 minutes (`JOB_TTL_SECONDS`).

---

## 📜 License

Distributed under the MIT License. Built with ❤️ by UnitSpring Smart Digital Solutions.
