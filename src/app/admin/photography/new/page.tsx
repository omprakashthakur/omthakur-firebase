
"use client";

import PhotographyForm from '@/components/photography-form';

export default function NewPhotographyPage() {
  return (
     <>
        <header className="mb-12">
            <h1 className="text-5xl font-headline font-bold">Add New Photo</h1>
            <p className="text-xl text-muted-foreground">Fill out the form below to add a new photo to the gallery.</p>
        </header>
        <PhotographyForm />
    </>
  );
}
