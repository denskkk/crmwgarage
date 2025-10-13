// Supabase configuration
// Для production ці значення мають бути в змінних оточення Vercel/Netlify
// Для GitHub Pages можна жорстко закодувати (anon key безпечний для фронтенду)

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://joxayhsnchiijuhxvfli.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveGF5aHNuY2hpaWp1aHh2ZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzQyMTIsImV4cCI6MjA3NTg1MDIxMn0.BD5YJGCjCnGq9K4jWslm9KROy-b1ENLedkY6i80ixyA',
  organizationId: import.meta.env.VITE_ORGANIZATION_ID || '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
};
