"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: false,
        },
      })

      if (signInError) {
        throw signInError
      }

      // The OAuth flow will redirect the user to Google
      // After authentication, they'll be redirected back to /auth/callback
    } catch (err: any) {
      console.error("Error signing in with Google:", err)
      setError(err.message || "Failed to sign in with Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: "40fr 60fr" }}>
      {/* Left Side - Image with Lyft Bank Branding */}
      <div className="relative">
        <img
          src="/images/pexels-jack-sparrow-4199524.jpg"
          alt="Payment terminal"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 left-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Lyft Bank</h1>
        </div>
      </div>

      {/* Right Side - Login Form with Dark Grainy Gradient Background */}
      <div
        className="relative flex flex-col min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, #1e3a8a 0%, rgba(30, 58, 138, 0.4) 30%, transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 25%, transparent 50%), linear-gradient(135deg, #0a0e27 0%, #0f172a 30%, #1e293b 60%, #0a0e27 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />

        {/* Back Button - Top Left */}
        <div className="relative z-10 p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 font-medium transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Centered Login Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome!</h1>
            <p className="text-gray-300 mb-8">Sign in to your account to continue.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="inline-flex bg-white hover:bg-[#e0e0e0] disabled:bg-blue-400 disabled:cursor-not-allowed text-black font-semibold py-3 px-8 rounded-full items-center justify-center gap-3 text-base transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
