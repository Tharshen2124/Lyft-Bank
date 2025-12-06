"use client"

import Link from "next/link"
import { Sparkles, X, Coins } from "lucide-react"
import { useState, useEffect } from "react"

interface Notification {
  id: string
  type?: string
  title: string
  subtitle?: string
  date: string
  time: string
  rsmAmount?: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am"
    },
    {
      id: "2",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "3",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "4",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "5",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "6",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "7",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "8",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
    {
      id: "9",
      title: "Transfer to Hamza Resources was made successfully!",
      date: "2nd Dec 2025",
      time: "11.46 am",
    },
  ])

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotifications = localStorage.getItem("lyft_notifications")
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications)
          // Merge saved notifications with existing ones, prioritizing saved ones
          setNotifications((prev) => {
            // Combine and deduplicate
            const combined = [...parsed, ...prev]
            const unique = combined.filter((notif, index, self) => 
              index === self.findIndex((n) => n.id === notif.id)
            )
            return unique
          })
        } catch (error) {
          console.error("Error loading notifications:", error)
        }
      }
    }
  }, [])

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((notif) => notif.id !== id)
    setNotifications(updated)
    
    // Update localStorage - only save RSM notifications
    if (typeof window !== "undefined") {
      const rsmNotifications = updated.filter(n => n.type === "rsm_savings")
      localStorage.setItem("lyft_notifications", JSON.stringify(rsmNotifications))
    }
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
            <Link href="/transfers" className="hover:opacity-80 text-sm">
              Transfers
            </Link>
            <Link href="/notifications" className="hover:opacity-80 text-sm font-medium">
              Notifications
            </Link>
          </nav>
        </div>
        <div className="bg-blue-700/50 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium text-sm">
          TA
        </div>
      </header>

      <main className="px-20 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0000FF] mb-10">Notifications</h2>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl border p-6 flex items-center gap-4 hover:shadow-sm transition-all group ${
                notification.type === "rsm_savings" 
                  ? "border-[#0000FF] bg-blue-50/30" 
                  : "border-gray-200 hover:border-[#0000FF]"
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === "rsm_savings" 
                  ? "bg-[#0000FF] bg-opacity-10" 
                  : "bg-blue-100"
              }`}>
                {notification.type === "rsm_savings" ? (
                  <Coins className="w-6 h-6 text-[#0000FF]" />
                ) : (
                  <svg className="w-6 h-6 text-[#0000FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${
                  notification.type === "rsm_savings" ? "text-[#0000FF]" : "text-gray-900"
                }`}>
                  {notification.title}
                </h3>
                {notification.subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{notification.subtitle}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
              </div>

              {/* Time and Delete */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">{notification.time}</span>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Delete notification"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications</p>
          </div>
        )}
      </main>
    </div>
  )
}
