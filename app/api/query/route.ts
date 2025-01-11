import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@/lib/supabase-server'

const API_KEY = process.env.GOOGLE_AI_API_KEY

if (!API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not set in environment variables')
}

export async function POST(req: Request) {
  try {
    const { query, fileId } = await req.json()
    const supabase = createServerClient()

    // Fetch file data from Supabase
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      You are an AI assistant analyzing CSV data. The data includes the following fields:
      ${file.column_names.join(', ')}

      Here's a sample of the data:
      ${JSON.stringify(file.sample_data)}

      Please answer the following question about the CSV data:
      ${query}

      Provide a concise and accurate answer based on the data provided. 
      If the query asks for specific data, return it in a tabular format similar to the sample data.
      Do not include any explanations or SQL queries in your response.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    // Save the query to the database
    await supabase.from('queries').insert({
      file_id: fileId,
      natural_language_query: query,
      status: 'success',
    })

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Error processing query:', error)
    return NextResponse.json({ error: 'Failed to process query' }, { status: 500 })
  }
}

