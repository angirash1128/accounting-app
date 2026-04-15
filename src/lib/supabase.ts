import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdxpgaydvejgggkaebmd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkeHBnYXlkdmVqZ2dna2FlYm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTEyMDcsImV4cCI6MjA5MTc2NzIwN30.QFFyz07Odu5sEXF_MJMwhfaOFbMMrxPb84lgGrCk1Yo'

export const supabase = createClient(supabaseUrl, supabaseKey)