"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Session, User } from "@supabase/supabase-js"

export function useSupabaseAuth() {
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

  return {
    user,
    session,
    loading,
    signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }
}
