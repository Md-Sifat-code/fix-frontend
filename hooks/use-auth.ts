"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User, Session } from "@supabase/supabase-js"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session and user
    const getInitialSession = async () => {
      try {
        setLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
        })

        return () => {
          subscription.unsubscribe()
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  }

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    // Add additional auth methods as needed
    signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
    resetPassword: (email: string) => supabase.auth.resetPasswordForEmail(email),
  }
}
