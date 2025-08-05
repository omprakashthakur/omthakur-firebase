
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Photography } from '@/lib/data';

// GET a single photo by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const photoDoc = await getDoc(doc(db, 'photography', params.id));
    if (!photoDoc.exists()) {
        return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }
    return NextResponse.json({ ...photoDoc.data(), id: photoDoc.id });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching photo', error }, { status: 500 });
  }
}

// PUT (update) a photo by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedPhotoData: Partial<Omit<Photography, 'id'>> = await request.json();
    const photoRef = doc(db, 'photography', params.id);

    const photoSnap = await getDoc(photoRef);
    if (!photoSnap.exists()) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }
    
    await updateDoc(photoRef, updatedPhotoData);
    const updatedDoc = await getDoc(photoRef);

    return NextResponse.json({ ...updatedDoc.data(), id: updatedDoc.id });
  } catch (error) {
    let errorMessage = 'Error updating photo';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a photo by id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const photoRef = doc(db, 'photography', params.id);
    const photoSnap = await getDoc(photoRef);
    if (!photoSnap.exists()) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }
    
    await deleteDoc(photoRef);
    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting photo' }, { status: 500 });
  }
}
