
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VlogForm from '@/components/vlog-form';
import type { Vlog } from '@/lib/data';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';

export default function EditVlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [vlog, setVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
       const fetchVlog = async () => {
            const { data, error } = await supabase
                .from('vlogs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching vlog:', error);
                setLoading(false);
                return;
            }
            
            setVlog(data as Vlog);
            setLoading(false);
       }
       fetchVlog();
    }
  }, [id]);

  if (loading) {
    return <div className="flex h-[50vh] w-full items-center justify-center"><Spinner /></div>;
  }
  
  if (!vlog) {
    return <div>Vlog not found.</div>;
  }

  return (
    <>
      <header className="mb-12">
        <h1 className="text-5xl font-headline font-bold">Edit Vlog</h1>
        <p className="text-xl text-muted-foreground">Make changes to your vlog entry below.</p>
      </header>
      <VlogForm vlog={vlog} />
    </>
  );
}
