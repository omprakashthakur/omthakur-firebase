
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PhotographyForm from '@/components/photography-form';
import type { Photography } from '@/lib/data';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';

export default function EditPhotographyPage() {
  const params = useParams();
  const id = params.id as string;
  const [photo, setPhoto] = useState<Photography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const fetchPhoto = async () => {
            const { data, error } = await supabase
                .from('photography')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching photo:', error);
                setLoading(false);
                return;
            }

            setPhoto(data as Photography);
            setLoading(false);
        }
        fetchPhoto();
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
