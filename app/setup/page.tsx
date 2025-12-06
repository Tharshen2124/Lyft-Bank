"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, CheckCircle, X } from "lucide-react"
import Link from "next/link"

interface AIRecommendation {
  newMin: number
  newMax: number
  reasoning: string
  headline: string
}

// Helper function to check if current date is during festival season
function isFestivalSeason(): { isFestival: boolean; festivalName: string } {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate()

  // Hari Raya Aidilfitri (typically April-May)
  if (month === 4 || month === 5) {
    return { isFestival: true, festivalName: 'Hari Raya Aidilfitri' }
  }

  // Chinese New Year (typically January-February)
  if (month === 1 || (month === 2 && day <= 15)) {
    return { isFestival: true, festivalName: 'Chinese New Year' }
  }

  // Deepavali (typically October-November)
  if (month === 10 || month === 11) {
    return { isFestival: true, festivalName: 'Deepavali' }
  }

  // Christmas (December)
  if (month === 12) {
    return { isFestival: true, festivalName: 'Christmas' }
  }

  return { isFestival: false, festivalName: '' }
}

// Mock behavioral finance analysis (frontend only)
function analyzeUserContext(
  minAmount: number,
  maxAmount: number
): AIRecommendation {
  const { isFestival, festivalName } = isFestivalSeason()
  const today = new Date()
  const isPayday = today.getDate() === 1 || today.getDate() === 15

  // Mock balance (simulated - high/low based on random for demo)
  const mockBalance = Math.random() * 5000 + 1000 // RM 1000-6000
  const isHighBalance = mockBalance > 3000

  // Mock spending (simulated)
  const mockSpending = Math.random() * 2000 + 500 // RM 500-2500
  const isHighSpending = mockSpending > 1500

  let newMin = minAmount
  let newMax = maxAmount
  let reasoning = ''
  let headline = ''

  // Festival season: Reduce savings
  if (isFestival) {
    const reduction = 0.4 // 40% reduction
    newMin = Math.max(5, minAmount * (1 - reduction))
    newMax = Math.max(newMin + 5, maxAmount * (1 - reduction))
    headline = `Festive Season Adjustment - ${festivalName}`
    reasoning = `During ${festivalName}, we recommend reducing your savings by 40% to lessen financial burden. Your adjusted amounts allow you to enjoy the festivities while still maintaining your savings habit.`
  }
  // High balance or payday: Increase savings aggressively
  else if (isHighBalance || isPayday) {
    const increase = 0.35 // 35% increase
    newMin = minAmount * (1 + increase)
    newMax = maxAmount * (1 + increase)
    headline = isPayday ? 'Payday Boost - Save More!' : 'High Balance Detected - Maximize Savings'
    reasoning = isPayday
      ? 'It\'s payday! We recommend increasing your savings by 35% to take advantage of your increased cash flow. This helps build your savings faster while you have more disposable income.'
      : 'Your account balance is healthy. We recommend increasing your savings range by 35% to maximize your savings potential while maintaining financial comfort.'
  }
  // Low balance or high spending: Protect user
  else if (!isHighBalance || isHighSpending) {
    const reduction = 0.3 // 30% reduction
    newMin = Math.max(5, minAmount * (1 - reduction))
    newMax = Math.max(newMin + 5, maxAmount * (1 - reduction))
    headline = 'Financial Protection Mode'
    reasoning = 'We\'ve detected lower account balance or higher spending patterns. To protect your financial well-being, we recommend reducing your savings by 30%. This ensures you maintain adequate funds for essential expenses.'
  }
  // Default: Moderate adjustment
  else {
    const adjustment = 0.1 // 10% increase
    newMin = minAmount * (1 + adjustment)
    newMax = maxAmount * (1 + adjustment)
    headline = 'Optimized Savings Recommendation'
    reasoning = 'Based on your current financial context, we recommend a modest 10% increase in your savings range to help you build wealth gradually while maintaining financial stability.'
  }

  return {
    newMin: Math.round(newMin * 100) / 100,
    newMax: Math.round(newMax * 100) / 100,
    reasoning,
    headline,
  }
}

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

  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)

  const handleSubmit = () => {
    // Don't allow new recommendations if one has already been accepted
    if (hasAccepted) {
      return
    }

    setIsAnalyzing(true)
    setShowRecommendation(false)

    // Simulate analysis delay
    setTimeout(() => {
      const currentMin = parseFloat(minAmount) || 0
      const currentMax = parseFloat(maxAmount) || 0
      const recommendation = analyzeUserContext(currentMin, currentMax)
      
      setAiRecommendation(recommendation)
      setShowRecommendation(true)
      setIsAnalyzing(false)
    }, 1500) // 1.5 second delay to simulate AI analysis
  }

  const saveNotificationToHistory = (recommendation: AIRecommendation, action: 'accepted' | 'rejected', originalMin: number, originalMax: number) => {
    const now = new Date()
    const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })

    const actionText = action === 'accepted' ? 'Accepted' : 'Kept Original'
    const finalMin = action === 'accepted' ? recommendation.newMin : originalMin
    const finalMax = action === 'accepted' ? recommendation.newMax : originalMax

    const notification = {
      id: `rsm-ai-${Date.now()}`,
      type: "rsm_savings",
      title: `RSM Settings ${actionText}: ${recommendation.headline}`,
      subtitle: `AI recommended RM ${recommendation.newMin.toFixed(2)} - RM ${recommendation.newMax.toFixed(2)}. You ${action === 'accepted' ? 'accepted' : 'kept original'} RM ${finalMin.toFixed(2)} - RM ${finalMax.toFixed(2)}. ${recommendation.reasoning}`,
      date: date,
      time: time,
    }

    // Get existing notifications from localStorage
    const existingNotifications = typeof window !== "undefined" 
      ? JSON.parse(localStorage.getItem("lyft_notifications") || "[]")
      : []

    // Add new notification at the beginning
    const updatedNotifications = [notification, ...existingNotifications]

    // Save back to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("lyft_notifications", JSON.stringify(updatedNotifications))
    }
  }

  const acceptRecommendation = () => {
    if (aiRecommendation) {
      const originalMin = parseFloat(minAmount) || 0
      const originalMax = parseFloat(maxAmount) || 0
      
      setMinAmount(aiRecommendation.newMin.toFixed(2))
      setMaxAmount(aiRecommendation.newMax.toFixed(2))
      setShowRecommendation(false)
      setHasAccepted(true) // Mark as accepted to prevent further recommendations
      
      // Save to notifications
      saveNotificationToHistory(aiRecommendation, 'accepted', originalMin, originalMax)
      
      setAiRecommendation(null) // Clear the recommendation
    }
  }

  const rejectRecommendation = () => {
    if (aiRecommendation) {
      const originalMin = parseFloat(minAmount) || 0
      const originalMax = parseFloat(maxAmount) || 0
      
      setShowRecommendation(false)
      setHasAccepted(true) // Mark as accepted (keeping original) to prevent further recommendations
      
      // Save to notifications even when rejected
      saveNotificationToHistory(aiRecommendation, 'rejected', originalMin, originalMax)
      
      setAiRecommendation(null) // Clear the recommendation
    }
  }
  
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

          {/* AI Recommendation Card */}
          {showRecommendation && aiRecommendation && !hasAccepted && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-[#0000FF] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#0000FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#0000FF] mb-2">
                    {aiRecommendation.headline}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    {aiRecommendation.reasoning}
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Recommended Min</p>
                        <p className="text-lg font-semibold text-[#0000FF]">
                          RM {aiRecommendation.newMin.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Recommended Max</p>
                        <p className="text-lg font-semibold text-[#0000FF]">
                          RM {aiRecommendation.newMax.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={acceptRecommendation}
                      className="flex-1 px-4 py-2 bg-[#0000FF] hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Recommendation
                    </button>
                    <button
                      onClick={rejectRecommendation}
                      className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Keep Original
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button className="px-8 py-3 border-2 border-[#0000FF] text-[#0000FF] hover:bg-blue-50 bg-white rounded-md text-sm font-semibold transition-colors">
            Cancel
          </button>
          {hasAccepted ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Settings Saved</span>
              </div>
              <button
                onClick={() => {
                  // Save settings to localStorage
                  if (typeof window !== "undefined") {
                    localStorage.setItem("rsm_settings", JSON.stringify({
                      minAmount: parseFloat(minAmount) || 0,
                      maxAmount: parseFloat(maxAmount) || 0,
                      rangeMin,
                      rangeMax,
                    }))
                  }
                  // Redirect to accounts page
                  router.push("/accounts")
                }}
                className="px-8 py-3 bg-[#0000FF] hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors"
              >
                Submit
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-[#0000FF] hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Submit & Get AI Recommendation'
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}