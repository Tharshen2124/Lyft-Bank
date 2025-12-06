"use client"

import { useState } from "react"
import { Sparkles, Plus, Edit2, Power } from "lucide-react"
import Link from "next/link"

interface SavePocket {
  id: number
  name: string
  color: string
  balance: number
}

export default function AccountsPage() {
  const [mainAccountBalance, setMainAccountBalance] = useState(3900.0)
  const [rsmBalance, setRsmBalance] = useState(3900.0)
  const [isRSMEnabled, setIsRSMEnabled] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  
  const [pockets, setPockets] = useState<SavePocket[]>([
    { id: 1, name: "Pocket 1", color: "bg-cyan-300", balance: 780.0 },
    { id: 2, name: "Pocket 2", color: "bg-amber-100", balance: 780.0 },
    { id: 3, name: "Pocket 3", color: "bg-purple-300", balance: 780.0 },
  ])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleRSMToggle = () => {
    if (isRSMEnabled) {
      // Toggling OFF: Show confirmation dialog
      setShowConfirmDialog(true)
    } else {
      // Toggling ON: Start from 0
      setRsmBalance(0)
      setIsRSMEnabled(true)
    }
  }

  const confirmDisableRSM = () => {
    setMainAccountBalance(prev => prev + rsmBalance)
    setRsmBalance(0)
    setIsRSMEnabled(false)
    setShowConfirmDialog(false)
  }

  const cancelDisableRSM = () => {
    setShowConfirmDialog(false)
  }

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
        <p className="text-gray-900 mb-12 text-base">Total Balance: RM {(mainAccountBalance + rsmBalance + pockets.reduce((sum, p) => sum + p.balance, 0)).toFixed(2)}</p>

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
            <span className="text-gray-900 font-semibold">RM {mainAccountBalance.toFixed(2)}</span>
          </div>
        </section>

        {/* Random Savings Account */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Random Savings Account (RSM)</h3>
            <button
              onClick={handleRSMToggle}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                isRSMEnabled 
                  ? 'bg-[#0000FF]/80 hover:bg-[#0000FF]' 
                  : 'bg-gray-300/60 hover:bg-gray-300'
              }`}
              aria-label={isRSMEnabled ? 'Disable RSM' : 'Enable RSM'}
            >
              <Power 
                className={`absolute left-1.5 h-4 w-4 transition-all duration-300 ${
                  isRSMEnabled 
                    ? 'text-white opacity-90' 
                    : 'text-gray-500 opacity-40'
                }`}
              />
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isRSMEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {isRSMEnabled ? (
            <Link href="/accounts/rsm">
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-[#0000FF] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs">
                    RSM
                  </div>
                  <span className="text-gray-900 font-medium">RSM Account</span>
                </div>
                <span className="text-gray-900 font-semibold">RM {rsmBalance.toFixed(2)}</span>
              </div>
            </Link>
          ) : (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 flex items-center justify-between opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="bg-gray-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs">
                  RSM
                </div>
                <span className="text-gray-500 font-medium">RSM Account</span>
              </div>
              <span className="text-gray-500 font-semibold">RM {rsmBalance.toFixed(2)}</span>
            </div>
          )}
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#0000FF] mb-4">Disable RSM Account?</h3>
            <p className="text-gray-700 mb-2">
              Are you sure you want to disable your RSM Account?
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0000FF] p-4 rounded mb-6">
              <p className="text-sm text-gray-700">
                <strong>RM {rsmBalance.toFixed(2)}</strong> will be automatically transferred to your Main Account.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Your RSM Account will be reset to <strong>RM 0.00</strong> and disabled.
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelDisableRSM}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisableRSM}
                className="px-6 py-2.5 bg-[#0000FF] hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors"
              >
                Confirm & Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
