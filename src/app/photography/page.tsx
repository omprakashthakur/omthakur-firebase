
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Photography } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import Link from 'next/link';

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Photography | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/photography');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.status}`);
        }
        
        const data = await response.json();
        setPhotos(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photos');
        setPhotos([]); // Set to empty array instead of null
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading photography collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
        <p className="text-xl text-muted-foreground">Capturing moments, one frame at a time.</p>
      </header>

      {photos.length === 0 ? (
        <div className="text-center py-10">
          <p>No photos found in the collection.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid" onClick={() => setSelectedImage(photo)}>
              <Card className="overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0 relative">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="travel photography"
                    onError={(e) => {
                      // Fallback to a local placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/placeholder-image.jpg';
                      target.style.opacity = '0.7';
                    }}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          {selectedImage && (
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1600}
                height={900}
                onError={(e) => {
                  // Fallback to a local placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = '/placeholder-image.jpg';
                  target.style.opacity = '0.7';
                }}
                className="w-full h-auto object-contain rounded-lg"
                data-ai-hint="travel photography detail"
                sizes="100vw"
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
