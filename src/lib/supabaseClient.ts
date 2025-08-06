import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we have valid Supabase credentials
const isValidUrl = supabaseUrl && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseUrl.startsWith('http');

const isValidKey = supabaseAnonKey && 
  supabaseAnonKey !== 'your_supabase_anon_key_here';

// Create the real client if we have valid credentials
export const supabase = isValidUrl && isValidKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Mock client for development when no credentials are available
function createMockClient() {
  console.warn('Using mock Supabase client - provide real credentials for database access');
  
  // Mock data for development
  const mockData = {
    vlogs: [
      { 
        id: 1, 
        title: 'Sample Vlog 1', 
        platform: 'YouTube', 
        category: 'Travel',
        thumbnail: 'https://via.placeholder.com/400x300?text=Sample+Vlog+1',
        url: 'https://youtube.com',
        created_at: new Date().toISOString() 
      },
      { 
        id: 2, 
        title: 'Sample Vlog 2', 
        platform: 'Instagram', 
        category: 'Food',
        thumbnail: 'https://via.placeholder.com/400x300?text=Sample+Vlog+2',
        url: 'https://instagram.com',
        created_at: new Date().toISOString() 
      }
    ],
    posts: [
      { 
        id: 1, 
        title: 'Sample Blog Post', 
        slug: 'hello-world',
        content: 'This is a sample blog post content.',
        created_at: new Date().toISOString() 
      }
    ],
    photography: [
      { 
        id: 1, 
        title: 'Sample Photo', 
        image_url: 'https://via.placeholder.com/800x600?text=Sample+Photo',
        created_at: new Date().toISOString() 
      }
    ]
  };
  
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ 
            data: mockData[table as keyof typeof mockData]?.find(item => item.id === value) || null, 
            error: null 
          }),
          order: () => Promise.resolve({ 
            data: mockData[table as keyof typeof mockData]?.find(item => item.id === value) || null, 
            error: null 
          })
        }),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => Promise.resolve({
            data: mockData[table as keyof typeof mockData] || [], 
            error: null
          })
        }),
        single: () => Promise.resolve({
          data: mockData[table as keyof typeof mockData]?.[0] || null,
          error: null
        })
      }),
      insert: (data: any[]) => ({
        select: () => Promise.resolve({
          data: { id: Math.floor(Math.random() * 1000), ...data[0] },
          error: null
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => Promise.resolve({
            data: { id: value, ...data },
            error: null
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          select: () => Promise.resolve({
            data: { id: value },
            error: null
          })
        })
      })
    })
  } as any;
}
