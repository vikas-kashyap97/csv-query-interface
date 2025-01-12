'use client'

import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { useSupabaseClient } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import Papa from 'papaparse'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onFileUploaded: (fileId: string, data: any) => void
  onFileSelected: (fileId: string) => void
}

export function FileUpload({ onFileUploaded, onFileSelected }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [files, setFiles] = useState<any[]>([])
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchFiles()
    // Fetch the example CSV file when component mounts
    fetchExampleCSV()
  }, [])

  const fetchExampleCSV = async () => {
    try {
      const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/query_results%20(1)-u9VN8wvBi38uLqMggEuPrDPekZFOqC.csv')
      const text = await response.text()
      
      Papa.parse(text, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // Create a formatted string for the ResultsTable
            const headers = Object.keys(results.data[0]).join('\t')
            const rows = results.data.map((row: any) => Object.values(row).join('\t')).join('\n')
            const formattedData = `${headers}\n${rows}`
            
            // Call onFileUploaded with the parsed data
            onFileUploaded('example', formattedData)
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching CSV:', error)
    }
  }

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching files:', error)
    } else {
      setFiles(data || [])
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    const simulateProgress = () => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }
    const progressInterval = setInterval(simulateProgress, 500)

    try {
      // Parse CSV file
      const results = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
        })
      })

      // Format the data for ResultsTable
      const headers = Object.keys(results.data[0]).join('\t')
      const rows = results.data.map(row => Object.values(row).join('\t')).join('\n')
      const formattedData = `${headers}\n${rows}`

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError, data } = await supabase.storage
        .from('csv-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create file record in database
      const { data: fileData, error: dbError } = await supabase.from('files').insert({
        filename: fileName,
        original_name: file.name,
        size_bytes: file.size,
        mime_type: file.type,
        status: 'ready',
        column_names: results.meta.fields,
        sample_data: results.data.slice(0, 100),
        row_count: results.data.length,
      }).select().single()

      if (dbError) throw dbError

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: 'File uploaded successfully',
        description: `Processed ${results.data.length} rows with ${results.meta.fields?.length} columns.`,
      })

      // Fetch updated file list
      await fetchFiles()

      // Call the callback with the formatted data
      if (fileData) {
        onFileUploaded(fileData.id, formattedData)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (fileId: string) => {
    onFileSelected(fileId)
  }

  const handleFileDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (error) throw error

      // Remove file from storage
      const file = files.find(f => f.id === fileId)
      if (file) {
        await supabase.storage
          .from('csv-files')
          .remove([file.filename])
      }

      toast({
        title: 'File deleted successfully',
        description: 'The file has been removed from your account.',
      })

      // Refresh the file list
      await fetchFiles()
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting your file. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <motion.div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={isUploading}
          className="relative bg-white text-purple-600 border-purple-600"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </Button>
        {isUploading && (
          <div className="w-[200px]">
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white shadow-sm rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Uploaded Files:</h3>
            <ul className="space-y-2">
              {files.map((file) => (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <button
                    onClick={() => handleFileSelect(file.id)}
                    className="text-left hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-gray-900"
                  >
                    {file.original_name}
                    <span className="text-sm text-gray-600 ml-2">
                      ({new Date(file.created_at).toLocaleString()})
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileDelete(file.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

