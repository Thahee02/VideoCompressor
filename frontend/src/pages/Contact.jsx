import React, { useState } from 'react'

const FAQS = [
  {
    q: 'Are my video files kept on your server?',
    a: 'No. Your videos are processed in temporary memory only and are never saved to a database or hard drive. Once you download your compressed file or leave the page, your video is completely deleted.',
  },
  {
    q: 'How does VideoPress reduce file size without losing quality?',
    a: 'Our smart compression algorithm removes redundant visual data that the human eye cannot notice, keeping playback smooth and colors sharp while cutting file size by up to 75%.',
  },
  {
    q: 'What video formats can I compress?',
    a: 'You can compress MP4, MOV, MKV, AVI, WEBM, FLV, and WMV video files up to 2 GB in size.',
  },
  {
    q: 'Is VideoPress really 100% free?',
    a: 'Yes, VideoPress is completely free with no hidden charges, trial limits, or account requirements.',
  },
]

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)
  }

  return (
    <div className="w-full space-y-16 pb-20 animate-fadeIn">
      
      {/* ── TALL HERO HEADER SECTION ── */}
      <section className="w-full min-h-[55vh] flex items-center bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200/80 py-20 sm:py-28 text-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Contact Us <span className="text-[#005A85]">& FAQ</span>
          </h1>
          <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Have questions or feedback? Send us a message below or browse our answers to common questions.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 space-y-6 shadow-md">
            <h2 className="text-3xl font-extrabold text-slate-900">Send Us a Message</h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="text-4xl">🎉</div>
                <h3 className="text-2xl font-bold text-emerald-900">Message Received!</h3>
                <p className="text-base text-emerald-700">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }) }}
                  className="px-6 py-3 rounded-xl bg-white text-sm font-bold text-slate-700 border border-slate-300 hover:bg-slate-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#005A85] focus:bg-white text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#005A85] focus:bg-white text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#005A85] focus:bg-white text-base transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#005A85] hover:bg-[#004769] text-white font-extrabold text-lg shadow-md transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      type="button"
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-lg hover:text-[#005A85] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sm text-slate-400">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
