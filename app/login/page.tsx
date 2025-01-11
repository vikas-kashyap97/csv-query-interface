'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSupabaseClient } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'

function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Login failed',
            description: 'Password incorrect. Please try again.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Login failed',
            description: 'Please confirm your verification via Gmail and try again.',
            variant: 'destructive',
          })
        }
        return
      }

      router.push('/')
    } catch (error) {
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100/50 py-10"
    >
      <div className="w-full max-w-md px-4">
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="inline-block">
            <svg
              viewBox="0 0 100 20"
              className="w-32 h-8 mx-auto mb-4"
            >
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#EAB308" />
                </linearGradient>
              </defs>
              <path
                d="M10 10 Q 25 0, 40 10 T 70 10 T 100 10"
                fill="none"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
              />
            </svg>
          </div>
          <motion.h1
            variants={itemVariants}
            className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500"
          >
            Welcome Back
          </motion.h1>
        </motion.div>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="bg-white/50 text-black"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 text-black"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  className="text-purple-500 border-black"
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>
            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link 
                href="/signup" 
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign Up
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

function LoggedOutMessage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loggedOut = searchParams.get('logged_out')

  useEffect(() => {
    if (loggedOut === 'true') {
      const timer = setTimeout(() => {
        router.replace('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loggedOut, router])

  if (loggedOut !== 'true') return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center">
      You have been successfully logged out. Redirecting...
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoggedOutMessage />
      <LoginForm />
    </Suspense>
  )
}

