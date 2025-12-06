"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, ArrowLeft, CheckCircle } from "lucide-react"

// Default RSM settings fallback
const DEFAULT_RSM_MIN = 5.00
const DEFAULT_RSM_MAX = 50.00

export default function TransactionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [rsmSavings, setRsmSavings] = useState(0)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [rsmMin, setRsmMin] = useState(DEFAULT_RSM_MIN)
  const [rsmMax, setRsmMax] = useState(DEFAULT_RSM_MAX)

  // Load RSM settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("rsm_settings")
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          if (settings.minAmount) setRsmMin(settings.minAmount)
          if (settings.maxAmount) setRsmMax(settings.maxAmount)
        } catch (error) {
          console.error("Error loading RSM settings:", error)
        }
      }
    }
  }, [])

  // Get user info from query params
  const userId = searchParams.get("userId")
  const userName = searchParams.get("name") || "Unknown User"
  const userMobile = searchParams.get("mobile") || ""
  const userBank = searchParams.get("bank") || ""

  // Calculate random RSM savings amount within the specified range
  const calculateRSMSavings = (min: number, max: number): number => {
    // Ensure min and max are valid numbers
    const validMin = Math.max(0, min || DEFAULT_RSM_MIN)
    const validMax = Math.max(validMin, max || DEFAULT_RSM_MAX)
    
    // Ensure min <= max
    const actualMin = Math.min(validMin, validMax)
    const actualMax = Math.max(validMin, validMax)
    
    // Generate random amount within range [min, max]
    // Math.random() gives [0, 1), so (max - min) * random gives [0, max - min)
    // Adding min gives [min, max)
    // To include max, we use (max - min + 0.01) to ensure we can reach max
    const range = actualMax - actualMin
    const randomAmount = actualMin + (Math.random() * range)
    
    // Round to 2 decimal places and clamp to ensure it's within bounds
    let result = Math.round(randomAmount * 100) / 100
    
    // Ensure result is within [min, max] range (safety clamp)
    result = Math.max(actualMin, Math.min(actualMax, result))
    
    return result
  }

  const saveNotificationToHistory = (rsmAmount: number, transferAmount: number, recipientName: string) => {
    const now = new Date()
    const date = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })

    const notification = {
      id: `rsm-${Date.now()}`,
      type: "rsm_savings",
      title: `RSM Savings: RM ${rsmAmount.toFixed(2)} saved to your RSM pocket!`,
      subtitle: `From transfer of RM ${transferAmount.toFixed(2)} to ${recipientName}`,
      date: date,
      time: time,
      rsmAmount: rsmAmount,
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

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount)
    
    if (!amount || isNaN(transferAmount) || transferAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setIsProcessing(true)

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Calculate RSM savings (random between saved min and max, or defaults)
    // Ensure values are valid before calculation
    const validMin = rsmMin > 0 ? rsmMin : DEFAULT_RSM_MIN
    const validMax = rsmMax >= validMin ? rsmMax : validMin + DEFAULT_RSM_MAX
    
    // Calculate savings - function ensures it's within [validMin, validMax] range
    const savings = calculateRSMSavings(validMin, validMax)
    
    // Final validation: ensure savings is within the exact range
    const finalSavings = Math.max(validMin, Math.min(validMax, savings))
    
    setRsmSavings(finalSavings)

    // Save transaction to localStorage for balance calculation
    if (typeof window !== "undefined") {
      const transactions = JSON.parse(localStorage.getItem("lyft_transactions") || "[]")
      const newTransaction = {
        id: `txn-${Date.now()}`,
        transferAmount: transferAmount,
        rsmSavings: finalSavings, // Use validated savings amount (guaranteed within range)
        recipient: userName,
        timestamp: new Date().toISOString(),
        rsmMin: validMin, // Store the range used for reference
        rsmMax: validMax,
      }
      transactions.push(newTransaction)
      localStorage.setItem("lyft_transactions", JSON.stringify(transactions))
      
      // Dispatch custom event to update accounts page in same tab
      window.dispatchEvent(new Event("transactionComplete"))
    }

    // Save notification to history
    saveNotificationToHistory(finalSavings, transferAmount, userName)

    setIsProcessing(false)
    setTransferSuccess(true)
    setShowNotification(true)

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  const handleBack = () => {
    router.push("/transfers")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0000FF] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-xl font-bold cursor-pointer hover:opacity-80">Lyft Bank</h1>
          </Link>
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
            <Link href="/transfers" className="hover:opacity-80 text-sm font-medium">
              Transfers
            </Link>
            <Link href="/notifications" className="hover:opacity-80 text-sm">
              Notifications
            </Link>
          </nav>
        </div>
        <div className="bg-blue-700/50 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium text-sm">
          TA
        </div>
      </header>

      {/* Main Content */}
      <main className="px-20 py-16 max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0000FF] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Transfers</span>
        </button>

        <h1 className="text-4xl font-bold text-[#0000FF] mb-10">Transfer Money</h1>

        {/* Recipient Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipient</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[#0000FF] font-semibold text-lg">{userName.charAt(0)}</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{userName}</div>
              <div className="text-sm text-gray-500">
                {userMobile} | {userBank}
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">RM</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={isProcessing || transferSuccess}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0000FF] text-gray-900 text-lg font-semibold disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={isProcessing || transferSuccess || !amount}
          className="w-full bg-[#0000FF] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full px-8 py-4 text-lg font-semibold transition-colors"
        >
          {isProcessing ? "Processing..." : transferSuccess ? "Transfer Completed" : "Transfer Money"}
        </button>

        {/* Success Message */}
        {transferSuccess && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">
              Transfer of RM {parseFloat(amount).toFixed(2)} to {userName} was successful!
            </p>
          </div>
        )}
      </main>

      {/* RSM Savings Notification Popup */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-in fade-in zoom-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0000FF]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">RSM Savings!</h3>
              <p className="text-gray-600 mb-6">
                You've saved <span className="font-bold text-[#0000FF] text-xl">RM {rsmSavings.toFixed(2)}</span> in your RSM pocket from this transaction!
              </p>
              <button
                onClick={() => setShowNotification(false)}
                className="w-full bg-[#0000FF] hover:bg-blue-700 text-white rounded-full px-6 py-3 font-semibold transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

