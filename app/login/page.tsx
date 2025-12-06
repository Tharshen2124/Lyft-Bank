"use client"

import Link from "next/link"

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    console.log("[v0] Google sign-in clicked")
    // Handle Google authentication here
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

      {/* Right Side - Login Form with Clean Gradient Background */}
      <div
        className="relative flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, #4169E1 0%, rgba(65, 105, 225, 0.3) 25%, transparent 50%), radial-gradient(ellipse at 0% 100%, #00CED1 0%, rgba(0, 206, 209, 0.2) 20%, transparent 40%), linear-gradient(135deg, #000814 0%, #001d3d 40%, #003566 70%, #001d3d 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Back Button */}
        <div className="absolute top-8 left-10 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-200 font-medium text-sm">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Back
          </Link>
        </div>

        {/* Centered Login Content */}
        <div className="flex-1 flex items-center justify-center px-12 relative z-10">
          <div className="w-full max-w-md text-center space-y-4">
            <h1 className="text-3xl font-serif font-bold text-white mb-1">Welcome!</h1>
            <p className="text-white text-sm mb-5">Sign in to your account to continue.</p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full max-w-xs mx-auto bg-[#0000FF] hover:bg-[#0000DD] text-white font-sans font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
