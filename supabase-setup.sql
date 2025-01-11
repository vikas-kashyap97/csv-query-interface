-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('processing', 'ready', 'error')),
    column_names JSONB,
    sample_data JSONB,
    row_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    file_id UUID REFERENCES public.files(id),
    natural_language_query TEXT NOT NULL,
    sql_query TEXT,
    status TEXT NOT NULL CHECK (status IN ('success', 'error')),
    error_message TEXT,
    execution_time_ms INTEGER,
    result_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create view for user statistics
CREATE VIEW public.user_statistics AS
SELECT
    u.id AS user_id,
    COUNT(DISTINCT f.id) AS total_files,
    COUNT(DISTINCT q.id) AS total_queries,
    COALESCE(SUM(f.size_bytes), 0) AS total_storage_bytes,
    MAX(q.created_at) AS last_query_at
FROM
    auth.users u
LEFT JOIN public.files f ON u.id = f.user_id
LEFT JOIN public.queries q ON u.id = q.user_id
GROUP BY u.id;

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view their own files"
    ON public.files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files"
    ON public.files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
    ON public.files FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
    ON public.files FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own queries"
    ON public.queries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queries"
    ON public.queries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queries"
    ON public.queries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queries"
    ON public.queries FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.files TO authenticated;
GRANT ALL ON public.queries TO authenticated;
GRANT SELECT ON public.user_statistics TO authenticated;

-- Create Storage bucket for CSV files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('csv-files', 'csv-files', false);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'csv-files');

-- Allow authenticated users to read their files
CREATE POLICY "Allow authenticated users to read their files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'csv-files' AND auth.uid() = owner);

-- Allow authenticated users to update their files
CREATE POLICY "Allow authenticated users to update their files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'csv-files' AND auth.uid() = owner);

-- Allow authenticated users to delete their files
CREATE POLICY "Allow authenticated users to delete their files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'csv-files' AND auth.uid() = owner);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to automatically set user_id
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to set user_id on file insert
CREATE TRIGGER set_files_user_id
BEFORE INSERT ON public.files
FOR EACH ROW
EXECUTE FUNCTION public.set_user_id();

-- Trigger to set user_id on query insert
CREATE TRIGGER set_queries_user_id
BEFORE INSERT ON public.queries
FOR EACH ROW
EXECUTE FUNCTION public.set_user_id();

