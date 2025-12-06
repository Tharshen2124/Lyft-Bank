"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [minAmount, setMinAmount] = useState("0.00")
  const [maxAmount, setMaxAmount] = useState("0.00")
  const [rangeMin, setRangeMin] = useState(0)
  const [rangeMax, setRangeMax] = useState(0)

  // Fixed slider range from 0 to 30
  const sliderMax = 30

  // Helper function to round to nearest 0.5
  const roundToHalf = (value: number): number => {
    return Math.round(value * 2) / 2
  }

  // Synchronize slider to manual inputs (slider is visual representation)
  useEffect(() => {
    const min = parseFloat(minAmount)
    const max = parseFloat(maxAmount)
    
    if (!isNaN(min) && min >= 0) {
      const rounded = roundToHalf(min)
      const clamped = Math.max(0, Math.min(30, rounded))
      setRangeMin(clamped)
    }
    if (!isNaN(max) && max >= 0) {
      const rounded = roundToHalf(max)
      const clamped = Math.max(0, Math.min(30, rounded))
      setRangeMax(clamped)
    }
  }, [minAmount, maxAmount])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0000FF] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">Lyft Bank</h1>
          <Link href="/ai">
            <button className="relative px-6 py-2.5 rounded-full text-white font-medium text-sm flex items-center gap-2 overflow-hidden group">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-[2px]">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0000FF] group-hover:bg-blue-600 transition-colors" />
              </span>
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-3 h-3 -ml-3" />
                Ask Lyft AI
              </span>
            </button>
          </Link>
          <nav className="flex items-center gap-8 ml-4">
            <Link href="/accounts" className="hover:opacity-80 text-sm">
              Accounts
            </Link>
            <a href="#" className="hover:opacity-80 text-sm">
              Transfers
            </a>
            <a href="#" className="hover:opacity-80 text-sm">
              Notifications
            </a>
          </nav>
        </div>
        <div className="bg-blue-700/50 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium text-sm">
          TA
        </div>
      </header>

      <main className="px-20 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0000FF] mb-3" style={{ fontFamily: "Times New Roman, serif" }}>
          Random Savings Pocket (RMS) Setup
        </h2>
        <p className="text-gray-900 mb-10 max-w-4xl text-base">
          Automate your savings effortlessly. Set your weekly transfer range, and we'll handle the rest by transferring
          a random amount within your chosen range each week.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
          {/* Weekly Transfer Range */}
          <div className="mb-8">
            <label className="block text-gray-900 font-semibold mb-6 text-base">Weekly Transfer Range</label>
            <div className="relative px-2 pt-1 pb-1">
              {/* Gray background track */}
              <div className="relative h-2 bg-gray-300 rounded-full">
                {/* Blue progress line */}
                <div
                  className="absolute h-full bg-[#0000FF] rounded-full"
                  style={{
                    left: `${(rangeMin / sliderMax) * 100}%`,
                    width: `${((rangeMax - rangeMin) / sliderMax) * 100}%`,
                  }}
                />
                {/* Left handle (blue dot) */}
                <div
                  className="absolute w-4 h-4 bg-[#0000FF] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer border-2 border-white shadow-md"
                  style={{
                    left: `${(rangeMin / sliderMax) * 100}%`,
                  }}
                />
                {/* Right handle (blue dot) */}
                <div
                  className="absolute w-4 h-4 bg-[#0000FF] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer border-2 border-white shadow-md"
                  style={{
                    left: `${(rangeMax / sliderMax) * 100}%`,
                  }}
                />
              </div>

              {/* Invisible range inputs for interaction */}
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={rangeMin}
                onChange={(e) => {
                  const val = roundToHalf(Number(e.target.value))
                  if (val <= rangeMax) {
                    setRangeMin(val)
                    setMinAmount(val.toFixed(2))
                  }
                }}
                className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer z-10"
              />
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={rangeMax}
                onChange={(e) => {
                  const val = roundToHalf(Number(e.target.value))
                  if (val >= rangeMin) {
                    setRangeMax(val)
                    setMaxAmount(val.toFixed(2))
                  }
                }}
                className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer z-10"
              />

              <div className="flex justify-between mt-3 text-sm font-semibold text-[#0000FF]">
                <span>RM {minAmount || "0.00"}</span>
                <span>RM {maxAmount || "0.00"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-2 text-base">Minimum Amount</label>
              <input
                type="text"
                value={`RM ${minAmount}`}
                onChange={(e) => {
                  const rawValue = e.target.value.replace("RM ", "").replace(/[^0-9.]/g, "")
                  setMinAmount(rawValue)
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(minAmount)
                  if (isNaN(numValue) || numValue < 0) {
                    setMinAmount("0.00")
                  } else {
                    const rounded = roundToHalf(numValue)
                    const clamped = Math.max(0, Math.min(30, rounded))
                    const maxVal = parseFloat(maxAmount)
                    if (!isNaN(maxVal) && clamped > maxVal) {
                      const roundedMax = roundToHalf(maxVal)
                      setMinAmount(roundedMax.toFixed(2))
                    } else {
                      setMinAmount(clamped.toFixed(2))
                    }
                  }
                }}
                placeholder="RM 0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent text-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-900 font-semibold mb-2 text-base">Maximum Amount</label>
              <input
                type="text"
                value={`RM ${maxAmount}`}
                onChange={(e) => {
                  const rawValue = e.target.value.replace("RM ", "").replace(/[^0-9.]/g, "")
                  setMaxAmount(rawValue)
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(maxAmount)
                  if (isNaN(numValue) || numValue < 0) {
                    setMaxAmount("0.00")
                  } else {
                    const rounded = roundToHalf(numValue)
                    const clamped = Math.max(0, Math.min(30, rounded))
                    const minVal = parseFloat(minAmount)
                    if (!isNaN(minVal) && clamped < minVal) {
                      const roundedMin = roundToHalf(minVal)
                      setMaxAmount(roundedMin.toFixed(2))
                    } else {
                      setMaxAmount(clamped.toFixed(2))
                    }
                  }
                }}
                placeholder="RM 0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0000FF] focus:border-transparent text-gray-500"
              />
            </div>
          </div>

          <div className="bg-[#F5F0E8] border-l-4 border-[#B8997A] px-5 py-4 rounded-sm">
            <p className="text-[#8B7355] text-sm">
              Lyft bank will transfer a random amount of RM {minAmount || "0.00"} to RM {maxAmount || "0.00"} to your savings each week.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button className="px-8 py-3 border-2 border-[#0000FF] text-[#0000FF] hover:bg-blue-50 bg-white rounded-md text-sm font-semibold transition-colors">
            Cancel
          </button>
          <button className="px-8 py-3 bg-[#0000FF] hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors">
            Submit
          </button>
        </div>
      </main>
    </div>
  )
}