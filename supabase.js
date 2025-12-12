import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjhrekrqywueijuvokos.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHJla3JxeXd1ZWlqdXZva29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDMyNDYsImV4cCI6MjA4MTA3OTI0Nn0.Er7t365RgzKWOe4hLvX7Z6BdplaYiKQBSmZ6nwT1HlQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
