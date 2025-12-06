/**
 * API Route for Accounts
 * Fetches user accounts including Main Account, RSM Account, and Save Pockets
 */

import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Placeholder GET handler - add implementation when needed
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Accounts API endpoint - implementation coming soon" },
    { status: 200 }
  )
}
