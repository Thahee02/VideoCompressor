import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Left side) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#005A85] flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
              🎬
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#005A85] transition-colors">
                VideoPress
              </span>
              <span className="text-xs font-medium text-slate-500 -mt-1">
                Video Compressor
              </span>
            </div>
          </Link>

          {/* Menus (Right side) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-[#005A85] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/how-it-works')
                  ? 'bg-[#005A85] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/about')
                  ? 'bg-[#005A85] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/contact')
                  ? 'bg-[#005A85] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </Link>
          </nav>

        </div>
      </div>
    </header>
  )
}
