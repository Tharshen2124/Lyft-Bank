"use client"

import Link from "next/link"

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(ellipse at 100% 0%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 30%, #2a2a4a 60%, #1a1a3a 100%)",
      }}
    >
      {/* Copyright symbol in top right */}
      <div className="absolute top-6 right-6">
        <div className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center">
          <span className="text-white/60 text-sm font-serif">©</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center space-y-6 px-8">
        <h1 className="text-7xl font-bold text-white tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
          Lyft Bank
        </h1>

        <p className="text-gray-300 text-lg tracking-wide">Getting things Ryt by going Lyft.</p>

        <div className="pt-4">
          <Link href="/login">
            <button className="bg-white hover:bg-gray-100 text-black font-semibold px-12 py-3.5 rounded-full text-base transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
