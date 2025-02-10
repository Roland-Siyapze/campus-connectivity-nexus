
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gydqtvubtptilqoxlhhs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZHF0dnVidHB0aWxxb3hsaGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NjE1MjEsImV4cCI6MjAyMzQzNzUyMX0.Yb9_iJKvQkfbRTggEk6qwPcEybEFX_bpOlDEJE8O7wQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
