
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PhotographyForm from '@/components/photography-form';
import type { Photography } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Spinner } from '@/components/ui/spinner';

export default function EditPhotographyPage() {
  const params = useParams();
  const id = params.id as string;
  const [photo, setPhoto] = useState<Photography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const fetchPhoto = async () => {
            const photoDoc = await getDoc(doc(db, 'photography', id));
            if (photoDoc.exists()) {
                setPhoto({ ...photoDoc.data(), id: photoDoc.id } as Photography);
            }
            setLoading(false);
        }
        fetchPhoto().catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="flex h-[50vh] w-full items-center justify-center"><Spinner /></div>;
  }
  
  if (!photo) {
    return <div>Photo not found.</div>;
  }

  return (
    <>
      <header className="mb-12">
        <h1 className="text-5xl font-headline font-bold">Edit Photo</h1>
        <p className="text-xl text-muted-foreground">Make changes to the photo details below.</p>
      </header>
      <PhotographyForm photo={photo} />
    </>
  );
}
