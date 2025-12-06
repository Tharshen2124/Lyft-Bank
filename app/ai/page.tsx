"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sparkles, ImageIcon, Paperclip, Send } from "lucide-react"
import Link from "next/link"

export default function AIPage() {
  const [message, setMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)])
      console.log(
        "[v0] Image files uploaded:",
        Array.from(files).map((f) => f.name),
      )
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)])
      console.log(
        "[v0] Document files uploaded:",
        Array.from(files).map((f) => f.name),
      )
    }
  }

  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      console.log("[v0] Sending message:", message)
      console.log(
        "[v0] With files:",
        uploadedFiles.map((f) => f.name),
      )
      // Reset form
      setMessage("")
      setUploadedFiles([])
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1a1a4d] via-[#0000FF] to-[#00CED1]">
      <header className="bg-[#0000FF] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold hover:opacity-80">
            Lyft Bank
          </Link>
          <button className="relative px-6 py-2.5 rounded-full text-white font-medium text-sm flex items-center gap-2 overflow-hidden group">
            {/* Gradient border */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-[2px]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0000FF] group-hover:bg-blue-600 transition-colors" />
            </span>
            {/* Content */}
            <span className="relative flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <Sparkles className="w-3 h-3 -ml-3" />
              Ask Lyft AI
            </span>
          </button>
          <nav className="flex items-center gap-8 ml-4">
            <Link href="/accounts" className="hover:opacity-80 text-sm">
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-semibold text-white">Lyft AI</h1>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">How can I help you?</h2>

        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
          {uploadedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="bg-white/20 px-3 py-1 rounded-lg text-sm text-white flex items-center gap-2">
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Lyft AI"
            className="w-full bg-transparent text-white placeholder:text-white/50 border-none outline-none resize-none text-base min-h-[100px]"
            rows={4}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-white/70" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Paperclip className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim() && uploadedFiles.length === 0}
              className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
