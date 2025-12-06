"use client"

import { useState } from "react"
import { Sparkles, Plus, Edit2 } from "lucide-react"
import Link from "next/link"

interface SavePocket {
  id: number
  name: string
  color: string
  balance: number
}

export default function AccountsPage() {
  const [pockets, setPockets] = useState<SavePocket[]>([
    { id: 1, name: "Pocket 1", color: "bg-cyan-300", balance: 780.0 },
    { id: 2, name: "Pocket 2", color: "bg-amber-100", balance: 780.0 },
    { id: 3, name: "Pocket 3", color: "bg-purple-300", balance: 780.0 },
  ])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const addPocket = () => {
    const nextNumber = pockets.length + 1
    const colors = ["bg-cyan-300", "bg-amber-100", "bg-purple-300", "bg-pink-300", "bg-green-300", "bg-yellow-300"]
    const newPocket: SavePocket = {
      id: Date.now(),
      name: `Pocket ${nextNumber}`,
      color: colors[nextNumber % colors.length],
      balance: 0.0,
    }
    setPockets([...pockets, newPocket])
  }

  const startEditing = (pocket: SavePocket) => {
    setEditingId(pocket.id)
    setEditingName(pocket.name)
  }

  const saveEdit = (id: number) => {
    setPockets(pockets.map((p) => (p.id === id ? { ...p, name: editingName } : p)))
    setEditingId(null)
    setEditingName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
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
            <Link href="/accounts" className="hover:opacity-80 text-sm font-medium">
              Accounts
            </Link>
            <Link href="/transfers" className="hover:opacity-80 text-sm">
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

      <main className="px-20 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0000FF] mb-2">My Accounts</h2>
        <p className="text-gray-900 mb-12 text-base">Total Balance: RM 4900.00</p>

        {/* Ready to spend */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to spend</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-[#0000FF] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs">
                Lyft
              </div>
              <span className="text-gray-900 font-medium">Main Account</span>
            </div>
            <span className="text-gray-900 font-semibold">RM 3900.00</span>
          </div>
        </section>

        {/* Random Savings Account */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Random Savings Account (RSM)</h3>
          <Link href="/accounts/rsm">
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-[#0000FF] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs">
                  RSM
                </div>
                <span className="text-gray-900 font-medium">RSM Account</span>
              </div>
              <span className="text-gray-900 font-semibold">RM 3900.00</span>
            </div>
          </Link>
        </section>

        {/* Save Pockets */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Pockets</h3>
          <div className="space-y-4 mb-8">
            {pockets.map((pocket) => (
              <div
                key={pocket.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`${pocket.color} rounded-full w-12 h-12`} />
                  {editingId === pocket.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(pocket.id)
                          if (e.key === "Escape") cancelEdit()
                        }}
                        className="border border-[#0000FF] rounded px-2 py-1 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(pocket.id)}
                        className="bg-[#0000FF] hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="border border-gray-300 text-gray-600 text-xs px-3 py-1 bg-white hover:bg-gray-50 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-900 font-medium">{pocket.name}</span>
                      <button
                        onClick={() => startEditing(pocket)}
                        className="ml-2 text-gray-400 hover:text-[#0000FF] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <span className="text-gray-900 font-semibold">RM {pocket.balance.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={addPocket}
              className="bg-[#0000FF] hover:bg-blue-700 text-white rounded-full px-8 py-6 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Save Pocket
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
