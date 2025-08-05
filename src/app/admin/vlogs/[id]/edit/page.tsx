
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VlogForm from '@/components/vlog-form';
import type { Vlog } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Spinner } from '@/components/ui/spinner';

export default function EditVlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [vlog, setVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
       const fetchVlog = async () => {
            const vlogDoc = await getDoc(doc(db, 'vlogs', id));
            if (vlogDoc.exists()) {
                setVlog({ ...vlogDoc.data(), id: vlogDoc.id } as Vlog);
            }
            setLoading(false);
       }
       fetchVlog().catch(() => setLoading(false));
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
