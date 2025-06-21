import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            success: false,
            error: "Profile not found",
          },
          {
            status: 404,
          },
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error(`Error fetching profile ${params.id}:`, error)
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First check if the profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          {
            success: false,
            error: "Profile not found",
          },
          {
            status: 404,
          },
        )
      }
      throw fetchError
    }

    // Get the request body
    const body = await request.json()

    // Update the profile and return the updated record
    const { data, error } = await supabase.from("profiles").update(body).eq("id", params.id).select().single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error(`Error updating profile ${params.id}:`, error)
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First check if the profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          {
            success: false,
            error: "Profile not found",
          },
          {
            status: 404,
          },
        )
      }
      throw fetchError
    }

    // Delete the profile
    const { error } = await supabase.from("profiles").delete().eq("id", params.id)

    if (error) throw error

    // Return a success message
    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    })
  } catch (error: any) {
    console.error(`Error deleting profile ${params.id}:`, error)
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
