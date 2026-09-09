import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#005A85] flex items-center justify-center text-white text-base font-bold shadow-sm">
                🎬
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">VideoPress</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Fast, simple, and secure video compression. Reduce file size for email, web, and social media without sacrificing video quality.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
              <li><Link to="/" className="hover:text-[#005A85] transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#005A85] transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-[#005A85] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#005A85] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Privacy Promise</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> No File Storage
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Auto Delete After Download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Free to Use
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VideoPress Digital Solutions. All rights reserved.</p>
          <p>Designed for fast and easy video optimization.</p>
        </div>
      </div>
    </footer>
  )
}
