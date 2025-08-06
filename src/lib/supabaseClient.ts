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
        id: 'mock-1', 
        title: 'Mock Travel Vlog from Tokyo', 
        platform: 'YouTube', 
        category: 'Travel',
        thumbnail: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        created_at: new Date().toISOString(),
        description: 'Exploring the vibrant streets of Tokyo and its unique culture'
      },
      { 
        id: 'mock-2', 
        title: 'Italian Pasta Recipe', 
        platform: 'YouTube', 
        category: 'Food',
        thumbnail: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        description: 'Learn how to make authentic Italian pasta from scratch'
      },
      { 
        id: 'mock-3', 
        title: 'Daily Morning Routine', 
        platform: 'Instagram', 
        category: 'Lifestyle',
        thumbnail: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
        url: 'https://www.instagram.com/',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        description: 'My healthy morning routine to start the day right'
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
