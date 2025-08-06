
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Photography } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { generatePlaceholderImage } from '@/lib/utils';

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Photography | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const photosPerPage = 15;

  useEffect(() => {
    fetchPhotos(currentPage);
  }, [currentPage]);

  const fetchPhotos = async (page: number) => {
    try {
      setLoading(true);
      
      let allPhotos: Photography[] = [];
      let errorMessages = [];
      
      // Fetch your personal photos from database
      try {
        const regularResponse = await fetch('/api/photography');
        const regularData = await regularResponse.json();
        
        if (Array.isArray(regularData)) {
          // Add source indicator
          const personalPhotos = regularData.map(photo => ({
            ...photo,
            source: 'personal',
            category: 'personal'
          }));
          allPhotos = [...allPhotos, ...personalPhotos];
        }
      } catch (err) {
        console.error('Error fetching personal photos:', err);
        errorMessages.push('Could not load personal photos');
      }
      
      // Fetch your Pexels photos (only if we don't have enough personal photos)
      if (allPhotos.length < photosPerPage) {
        try {
          const pexelsResponse = await fetch('/api/pexels');
          const pexelsData = await pexelsResponse.json();
          
          if (Array.isArray(pexelsData)) {
            // Add source indicator and filter to only show your photos
            const yourPexelsPhotos = pexelsData
              .filter(photo => 
                photo.photographerName && 
                (photo.photographerName.toLowerCase().includes('om') &&
                (photo.photographerName.toLowerCase().includes('prakash') || 
                 photo.photographerName.toLowerCase().includes('thakur')))
              )
              .map(photo => ({
                ...photo,
                source: 'pexels',
                category: 'pexels'
              }));
            allPhotos = [...allPhotos, ...yourPexelsPhotos];
          }
        } catch (err) {
          console.error('Error fetching Pexels photos:', err);
          errorMessages.push('Could not load Pexels photos');
        }
      }
      
      // Sort by creation date (newest first)
      allPhotos.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      
      // Implement pagination
      const startIndex = (page - 1) * photosPerPage;
      const paginatedPhotos = allPhotos.slice(startIndex, startIndex + photosPerPage);
      
      setPhotos(paginatedPhotos);
      setTotalPhotos(allPhotos.length);
      
      // Only set error if both APIs failed and we have no photos
      if (errorMessages.length > 0 && allPhotos.length === 0) {
        setError(errorMessages.join('. '));
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPhotos / photosPerPage);

  const handleDownload = async (photo: Photography) => {
    try {
      const downloadUrl = photo.downloadUrl || photo.src;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo-${photo.id || Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(photo.downloadUrl || photo.src, '_blank');
    }
  };
            pexelsData = [];
          }
        } catch (err) {
          console.error('Error fetching Pexels photos:', err);
          errorMessages.push('Could not load Pexels photos');
          pexelsData = [];
        }
        
        // Combine both sets of photos
        const allPhotos = [...regularData, ...pexelsData];
        
        // Sort by creation date (newest first)
        allPhotos.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        
        setPhotos(allPhotos);
        
        // Only set error if both APIs failed and we have no photos
        if (errorMessages.length > 0 && allPhotos.length === 0) {
          setError(errorMessages.join('. '));
        } else {
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllPhotos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
          <p className="text-xl text-muted-foreground">Loading your photography collection...</p>
        </header>
        
        {/* Skeleton loader for photos */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0 relative">
                  <div 
                    className="w-full h-[300px] bg-muted animate-pulse"
                    style={{
                      backgroundImage: `linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)`,
                      backgroundSize: '200% 100%'
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && photos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
          <p className="text-xl text-muted-foreground">Capturing moments, one frame at a time.</p>
        </header>
        
        <div className="max-w-md mx-auto bg-card rounded-lg p-8 shadow-lg border border-border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 12v4"></path>
                <path d="M12 18h.01"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Error Loading Photos</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Show warning if there was an error but we still have some photos
  const hasPartialError = error && photos.length > 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
        <p className="text-xl text-muted-foreground">Capturing moments, one frame at a time.</p>
      </header>
      
      {/* Show warning banner for partial errors */}
      {hasPartialError && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {error} Some photos may not be displayed.
              </p>
            </div>
          </div>
        </div>
      )}

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
                      // Generate dynamic SVG placeholder
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = generatePlaceholderImage(600, 600, 'Image Unavailable');
                      target.style.opacity = '0.8';
                    }}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Show source badge for Pexels photos */}
                  {photo.id?.toString().startsWith('pexels-') && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      Pexels
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {selectedImage?.title || selectedImage?.alt || 'Photography Image'}
          </DialogTitle>
          {selectedImage && (
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1600}
                height={900}
                onError={(e) => {
                  // Generate dynamic SVG placeholder for the large modal view
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = generatePlaceholderImage(1600, 900, 'High Resolution Image Unavailable');
                  target.style.opacity = '0.8';
                }}
                className="w-full h-auto object-contain rounded-lg"
                data-ai-hint="travel photography detail"
                sizes="100vw"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {/* Download button - Show for your photos or if originalUrl exists for Pexels photos */}
                {(selectedImage.downloadUrl || selectedImage.originalUrl) && (
                  <Button asChild variant="secondary" size="icon">
                    <Link href={selectedImage.downloadUrl || selectedImage.originalUrl || '#'} download={!selectedImage.originalUrl} target={selectedImage.originalUrl ? "_blank" : undefined}>
                      <Download className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button variant="secondary" size="icon" onClick={() => setSelectedImage(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Show Pexels attribution if it's a Pexels photo */}
              {selectedImage.id?.toString().startsWith('pexels-') && selectedImage.photographerName && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md">
                  Photo by{' '}
                  <a 
                    href={selectedImage.photographerUrl || "https://www.pexels.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-300"
                  >
                    {selectedImage.photographerName}
                  </a>
                  {' '}on{' '}
                  <a 
                    href="https://www.pexels.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-300"
                  >
                    Pexels
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
