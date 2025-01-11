'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabaseClient } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
            phone,
          },
        },
      })

      if (error) throw error

      toast({
        title: 'Sign up successful',
        description: 'Please check your email to verify your account.',
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: 'There was an error signing up. Please try again.',
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
            Create Your Account
          </motion.h1>
        </motion.div>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/50 text-black"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/50 text-black"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/50 text-black"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </motion.div>
            </form>
            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Log In
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

