"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Search, X } from "lucide-react"

interface User {
  id: number
  name: string
  mobile: string
  bank: string
}

export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Ariff bin Abu", mobile: "123456789", bank: "Maybank" },
    { id: 2, name: "Ariff bin Abu", mobile: "123456789", bank: "Maybank" },
    { id: 3, name: "Ariff bin Abu", mobile: "123456789", bank: "Maybank" },
    { id: 4, name: "Sarah Lee", mobile: "987654321", bank: "CIMB" },
    { id: 5, name: "Ahmad Hassan", mobile: "555123456", bank: "RHB" },
  ])

  const removeUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.mobile.includes(searchQuery),
  )

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
      <main className="px-20 py-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0000FF] mb-10">Transfers</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search name or mobile number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0000FF] text-gray-700 placeholder:text-gray-400"
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Recent Transfers */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent</h2>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-full flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#0000FF] hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0000FF] font-semibold text-lg">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.mobile} | {user.bank}
                    </div>
                  </div>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Remove contact"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No users found matching "{searchQuery}"</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
