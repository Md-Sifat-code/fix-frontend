import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
// import { profilesService } from '@/services/profiles-service';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const name = searchParams.get("name")

    let query = supabase.from("profiles").select("*")

    // Apply filters if provided
    if (id) {
      query = query.eq("id", id)
    }

    if (name) {
      query = query.ilike("name", `%${name}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        {
          status: 400,
        },
      )
    }

    // Insert and return the created record
    const { data, error } = await supabase.from("profiles").insert(body).select().single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 201,
      },
    )
  } catch (error: any) {
    console.error("Error creating profile:", error)

    // Handle unique constraint violations
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "A profile with this name already exists",
        },
        {
          status: 409,
        },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    )
  }
}
