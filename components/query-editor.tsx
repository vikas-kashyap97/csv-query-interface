'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSupabaseClient } from '@/components/supabase-provider'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

interface QueryEditorProps {
  fileId: string
  onQueryResult: (result: string) => void
}

export function QueryEditor({ fileId, onQueryResult }: QueryEditorProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const startTime = performance.now()
      
      // Send query to API for processing
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, fileId }),
      })

      if (!response.ok) throw new Error('Query failed')
      
      const result = await response.json()
      onQueryResult(result.answer)

      const endTime = performance.now()
      const executionTime = Math.round(endTime - startTime)

      toast({
        title: 'Query processed successfully',
        description: `Execution time: ${executionTime}ms`,
      })
    } catch (error) {
      console.error('Query error:', error)
      toast({
        title: 'Query failed',
        description: 'There was an error processing your query. Please try again.',
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
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query in natural language..."
          className="min-h-[100px] font-mono bg-white/50 text-black border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !query.trim()}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:opacity-90 transition-opacity text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Query
        </Button>
      </motion.div>
    </motion.div>
  )
}

