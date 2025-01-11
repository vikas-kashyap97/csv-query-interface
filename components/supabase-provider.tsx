'use client'

import { createContext, useContext, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [supabase] = useState(() => createClient())

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabaseClient = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabaseClient must be used inside SupabaseProvider')
  }
  return context.supabase
}

