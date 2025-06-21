import { NextResponse } from "next/server"

// This route is no longer used - PDF generation is now handled client-side
export async function POST(request: Request) {
  return NextResponse.json(
    {
      success: false,
      message: "This API route is deprecated. PDF generation is now handled client-side.",
    },
    { status: 200 },
  )
}
