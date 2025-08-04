
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PhotographyForm from '@/components/photography-form';
import type { Photography } from '@/lib/data';

export default function EditPhotographyPage() {
  const params = useParams();
  const id = params.id as string;
  const [photo, setPhoto] = useState<Photography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/photography/${id}`)
        .then(res => res.json())
        .then(data => {
          setPhoto(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
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
