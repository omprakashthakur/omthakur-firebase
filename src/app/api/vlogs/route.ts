
import { NextResponse } from 'next/server';
import { vlogs } from '@/lib/data';
import type { Vlog } from '@/lib/data';

// GET all vlogs
export async function GET() {
  return NextResponse.json(vlogs);
}

// POST a new vlog
export async function POST(request: Request) {
  try {
    const vlog: Omit<Vlog, 'id'> = await request.json();
    
    // Basic validation
    if (!vlog.title || !vlog.url || !vlog.platform || !vlog.category) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const newVlog = {
        ...vlog,
        id: Date.now(), // simple unique id
        thumbnail: 'https://placehold.co/600x400.png', // Placeholder
    };

    vlogs.unshift(newVlog); // Add to the beginning of the array
    return NextResponse.json(newVlog, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating vlog', error }, { status: 500 });
  }
}
