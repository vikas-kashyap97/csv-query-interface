'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function UserHeader() {
  const [user, setUser] = useState<any>(null)
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login?logged_out=true')
  }

  if (!user) return null

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">CSV Query</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-800">{user.email}</span>
          <Button onClick={handleLogout} variant="outline" size="sm" className="bg-white text-purple-600 border-purple-600">
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

