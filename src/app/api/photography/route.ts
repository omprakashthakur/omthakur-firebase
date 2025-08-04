import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Photography } from '@/lib/data';

// GET all photos
export async function GET() {
  try {
    const photosCollection = collection(db, 'photography');
    const photosSnapshot = await getDocs(photosCollection);
    const photosList = photosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return NextResponse.json(photosList);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching photos', error }, { status: 500 });
  }
}

// POST a new photo
export async function POST(request: Request) {
  try {
    const photoData: Omit<Photography, 'id'> = await request.json();
    
    if (!photoData.src || !photoData.alt || !photoData.downloadUrl) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const docRef = await addDoc(collection(db, 'photography'), photoData);

    return NextResponse.json({ id: docRef.id, ...photoData }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating photo entry', error }, { status: 500 });
  }
}
