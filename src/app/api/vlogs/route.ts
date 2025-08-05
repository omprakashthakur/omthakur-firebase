
import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Vlog } from '@/lib/data';

// GET all vlogs
export async function GET() {
  try {
    const vlogsCollection = collection(db, 'vlogs');
    const vlogsSnapshot = await getDocs(vlogsCollection);
    const vlogsList = vlogsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return NextResponse.json(vlogsList);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching vlogs', error }, { status: 500 });
  }
}

// POST a new vlog
export async function POST(request: Request) {
  try {
    const vlogData: Omit<Vlog, 'id'> = await request.json();
    
    if (!vlogData.title || !vlogData.url || !vlogData.platform || !vlogData.category) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const newVlog = {
        ...vlogData,
        thumbnail: `https://placehold.co/600x400.png?text=${encodeURIComponent(vlogData.title)}`,
    };

    const docRef = await addDoc(collection(db, 'vlogs'), newVlog);
    
    return NextResponse.json({ id: docRef.id, ...newVlog }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating vlog entry', error }, { status: 500 });
  }
}
