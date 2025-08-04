"use client";

import { useState } from 'react';
import Image from 'next/image';
import { photography, type Photography } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import Link from 'next/link';

export default function PhotographyPage() {
  const [selectedImage, setSelectedImage] = useState<Photography | null>(null);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
        <p className="text-xl text-muted-foreground">Capturing moments, one frame at a time.</p>
      </header>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photography.map((photo, index) => (
          <div key={index} className="break-inside-avoid" onClick={() => setSelectedImage(photo)}>
            <Card className="overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 relative">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="travel photography"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          {selectedImage && (
            <div className="relative">
               <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1600}
                height={900}
                className="w-full h-auto object-contain rounded-lg"
                data-ai-hint="travel photography detail"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button asChild variant="secondary" size="icon">
                  <Link href={selectedImage.downloadUrl} download>
                    <Download className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="secondary" size="icon" onClick={() => setSelectedImage(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
