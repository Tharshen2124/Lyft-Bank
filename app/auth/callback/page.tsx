"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL (Supabase returns tokens in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // Check for error in hash first
        const hashError = hashParams.get("error")
        const hashErrorDescription = hashParams.get("error_description")
        
        // Check for tokens in hash
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        
        // Check for error in query params
        const queryError = searchParams.get("error")
        
        // If there's an error in hash and no tokens, it's a real error
        if (hashError && !accessToken) {
          console.error("Auth error in hash:", hashError, hashErrorDescription)
          router.push(`/login?error=${encodeURIComponent(hashErrorDescription || hashError)}`)
          return
        }

        // If we have tokens, set the session (ignore query error if tokens exist)
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error("Session error:", sessionError)
            router.push(`/login?error=${encodeURIComponent(sessionError.message)}`)
            return
          }

          // Clear the hash from URL
          window.location.hash = ""
          
          // Get the next redirect URL or default to home
          const next = searchParams.get("next") || "/setup"
          router.push(next)
          return
        }

        // Check for code in query params (PKCE flow alternative)
        const code = searchParams.get("code")
        
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error("Exchange error:", exchangeError)
            router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
            return
          }

          const next = searchParams.get("next") || "/setup"
          router.push(next)
          return
        }

        // If query error exists and no tokens/code, show error
        if (queryError && !accessToken && !code) {
          router.push(`/login?error=${encodeURIComponent(queryError)}`)
          return
        }

        // No tokens, code, or clear error - something went wrong
        console.error("No authentication data found in callback URL")
        router.push("/login?error=no_auth_data")
      } catch (error: any) {
        console.error("Callback error:", error)
        router.push(`/login?error=${encodeURIComponent(error.message || "auth_failed")}`)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}

