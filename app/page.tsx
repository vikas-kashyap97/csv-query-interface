'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@/components/supabase-provider'
import { FileUpload } from '@/components/file-upload'
import { QueryEditor } from '@/components/query-editor'
import { ResultsTable } from '@/components/results-table'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [queryResult, setQueryResult] = useState<string | null>(null)
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session) {
        router.push('/login')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleFileUploaded = (fileId: string, data: any) => {
    setSelectedFile({ id: fileId, data })
    const headers = Object.keys(data[0]).join('\t')
    const rows = data.map((row: any) => Object.values(row).join('\t')).join('\n')
    setQueryResult(`${headers}\n${rows}`)
  }

  const handleFileSelected = async (fileId: string) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (error) {
      console.error('Error fetching file:', error)
      return
    }

    setSelectedFile(data)
    const headers = data.column_names.join('\t')
    const rows = data.sample_data.map((row: any) => Object.values(row).join('\t')).join('\n')
    setQueryResult(`${headers}\n${rows}`)
  }

  const handleQueryResult = (result: string) => {
    setQueryResult(result)
  }

  if (!session) {
    return null
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
      className="min-h-screen bg-gradient-to-b from-white to-gray-100/50 pt-20 pb-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            CSV Query Interface
          </motion.h1>
        </motion.div>
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <FileUpload onFileUploaded={handleFileUploaded} onFileSelected={handleFileSelected} />
          </motion.div>
          {selectedFile && (
            <>
              <motion.div variants={itemVariants}>
                <QueryEditor fileId={selectedFile.id} onQueryResult={handleQueryResult} />
              </motion.div>
              {queryResult && (
                <motion.div variants={itemVariants}>
                  <ResultsTable data={queryResult} />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

