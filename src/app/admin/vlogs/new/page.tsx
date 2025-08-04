
"use client";

import VlogForm from '@/components/vlog-form';

export default function NewVlogPage() {
  return (
     <>
        <header className="mb-12">
            <h1 className="text-5xl font-headline font-bold">Create New Vlog</h1>
            <p className="text-xl text-muted-foreground">Fill out the form below to add a new vlog.</p>
        </header>
        <VlogForm />
    </>
  );
}
