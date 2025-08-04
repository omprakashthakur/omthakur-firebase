import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/data';

// GET all blog posts
export async function GET() {
  try {
    const postsCollection = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = postsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return NextResponse.json(postsList);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts', error }, { status: 500 });
  }
}

// POST a new blog post
export async function POST(request: Request) {
  try {
    const post: Omit<BlogPost, 'id'> = await request.json();
    
    // Basic validation
    if (!post.title || !post.content || !post.slug) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where("slug", "==", post.slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return NextResponse.json({ message: 'Slug already exists, please choose a different title.' }, { status: 409 });
    }

    const docRef = await addDoc(postsCollection, post);
    
    return NextResponse.json({ id: docRef.id, ...post }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating post', error }, { status: 500 });
  }
}
