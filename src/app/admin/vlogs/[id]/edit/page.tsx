
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VlogForm from '@/components/vlog-form';
import type { Vlog } from '@/lib/data';

export default function EditVlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [vlog, setVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/vlogs/${id}`)
        .then(res => res.json())
        .then(data => {
          setVlog(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
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
