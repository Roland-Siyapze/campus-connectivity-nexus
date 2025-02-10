
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifemrlcngjpybfztfqji.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZW1ybGNuZ2pweWJmenRmcWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzYzODIsImV4cCI6MjA1NDc1MjM4Mn0.ClBU6mDN8oxMkpveJGC8uVt2NdHCWKiag6dUzqw-lHI';

export const supabase = createClient(supabaseUrl, supabaseKey);
