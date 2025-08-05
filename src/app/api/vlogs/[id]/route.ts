
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Vlog } from '@/lib/data';

// GET a single vlog by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vlogDoc = await getDoc(doc(db, 'vlogs', params.id));
    if (!vlogDoc.exists()) {
        return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
    }
    return NextResponse.json({ ...vlogDoc.data(), id: vlogDoc.id });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching vlog', error }, { status: 500 });
  }
}

// PUT (update) a vlog by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedVlogData: Partial<Omit<Vlog, 'id'>> = await request.json();
    const vlogRef = doc(db, 'vlogs', params.id);

    // Check if doc exists
    const vlogSnap = await getDoc(vlogRef);
    if (!vlogSnap.exists()) {
        return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
    }

    await updateDoc(vlogRef, updatedVlogData);
    const updatedDoc = await getDoc(vlogRef);

    return NextResponse.json({ ...updatedDoc.data(), id: updatedDoc.id });
  } catch (error) {
    let errorMessage = 'Error updating vlog';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a vlog by id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vlogRef = doc(db, 'vlogs', params.id);
    const vlogSnap = await getDoc(vlogRef);
    if (!vlogSnap.exists()) {
        return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
    }
    
    await deleteDoc(vlogRef);
    return NextResponse.json({ message: 'Vlog deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting vlog' }, { status: 500 });
  }
}
