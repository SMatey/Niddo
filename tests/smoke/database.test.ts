import { createClient } from '@supabase/supabase-js';

describe('Supabase Connection and RLS Smoke Test', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing in .env');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  test('should connect to Supabase and perform a simple query', async () => {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase Connection Error:', error.message, error.details, error.hint);
    }
    
    expect(error).toBeNull();
  });

  test('RLS: should deny anonymous insertions into profiles', async () => {
    const { error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: '00000000-0000-0000-0000-000000000000', 
          username: 'malicious_user', 
          full_name: 'Hackerman' 
        }
      ]);

    if (error) {
       // We log it just to see the exact code, but it's the expected behavior
       console.log('Expected RLS Denied Error:', error.code, error.message);
    }

    expect(error).not.toBeNull();
    // 42501 is PostgreSQL permission denied, which confirm RLS is working.
    // PGRST116 is for single row issues, but here we expect permission issues.
    expect(error?.code).toMatch(/42501|PGRST116|PGRST301/); 
  });

  test('RLS: should allow anonymous reading of active profiles', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('RLS Select Error:', error.message, error.details);
    }

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
