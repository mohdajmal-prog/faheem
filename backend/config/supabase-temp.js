// Temporary mock Supabase for testing without real connection
const mockSupabase = {
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock: No Supabase configured' } }),
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      gt: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      gte: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => Promise.resolve({ data: [], error: { message: 'Mock: No Supabase configured' } })
    }),
    update: () => ({
      eq: () => ({
        select: () => Promise.resolve({ data: [], error: { message: 'Mock: No Supabase configured' } })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: { message: 'Mock: No Supabase configured' } })
    })
  })
};

// Check if we have real Supabase credentials
const hasRealCredentials = process.env.SUPABASE_URL && 
  process.env.SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  process.env.SUPABASE_SERVICE_KEY && 
  process.env.SUPABASE_SERVICE_KEY !== 'your_actual_service_key_here';

if (hasRealCredentials) {
  // Use real Supabase
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false
    }
  });
  
  console.log('✅ Using real Supabase connection');
  module.exports = supabase;
} else {
  // Use mock for testing
  console.log('⚠️  Using mock Supabase - configure real credentials in .env');
  module.exports = mockSupabase;
}