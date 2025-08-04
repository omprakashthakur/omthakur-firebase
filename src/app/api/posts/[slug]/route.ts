import { NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/data';

async function getPostDocumentId(slug: string): Promise<string | null> {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    return querySnapshot.docs[0].id;
}


// GET a single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const docId = await getPostDocumentId(params.slug);
    if (!docId) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    const postDoc = await getDoc(doc(db, 'posts', docId));
    if (!postDoc.exists()) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ ...postDoc.data(), id: postDoc.id });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching post', error }, { status: 500 });
  }
}

// PUT (update) a blog post by slug
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const updatedPostData: Partial<Omit<BlogPost, 'slug'>> = await request.json();
    const docId = await getPostDocumentId(params.slug);
    
    if (!docId) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const postRef = doc(db, 'posts', docId);
    await updateDoc(postRef, updatedPostData);

    const updatedDoc = await getDoc(postRef);

    return NextResponse.json({ ...updatedDoc.data(), id: updatedDoc.id });
  } catch (error) {
    let errorMessage = 'Error updating post';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a blog post by slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const docId = await getPostDocumentId(params.slug);
    if (!docId) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    await deleteDoc(doc(db, 'posts', docId));
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
}
