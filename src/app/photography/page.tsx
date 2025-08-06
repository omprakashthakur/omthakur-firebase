"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Photography } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
      
      // Fetch photos from the main photography API (which includes both DB and Pexels collection)
      const response = await fetch('/api/photography');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the response is an error object
      if (data.error) {
        setError(data.message || 'Unable to load photography collection');
        setPhotos([]);
        setTotalPhotos(0);
        return;
      }
      
      // Check if we have valid photo data
      if (!Array.isArray(data) || data.length === 0) {
        setError('No photos found in your collection. Please add photos to your Pexels collection or database.');
        setPhotos([]);
        setTotalPhotos(0);
        return;
      }
      
      // Sort by creation date (newest first)
      const sortedPhotos = data.sort((a: Photography, b: Photography) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id || 0);
        const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id || 0);
        return dateB - dateA;
      });
      
      // Implement pagination
      const startIndex = (page - 1) * photosPerPage;
      const paginatedPhotos = sortedPhotos.slice(startIndex, startIndex + photosPerPage);
      
      setPhotos(paginatedPhotos);
      setTotalPhotos(sortedPhotos.length);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photography collection. Please ensure your Pexels API key is configured correctly.');
      setPhotos([]);
      setTotalPhotos(0);
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

  // Navigation functions for modal
  const handleNextPhoto = () => {
    if (!selectedImage) return;
    const currentIndex = photos.findIndex(photo => photo.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedImage(photos[nextIndex]);
  };

  const handlePreviousPhoto = () => {
    if (!selectedImage) return;
    const currentIndex = photos.findIndex(photo => photo.id === selectedImage.id);
    const previousIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    setSelectedImage(photos[previousIndex]);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (event.key) {
        case 'ArrowRight':
          handleNextPhoto();
          break;
        case 'ArrowLeft':
          handlePreviousPhoto();
          break;
        case 'Escape':
          setSelectedImage(null);
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImage, photos]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Photography</h1>
          <p className="text-xl text-muted-foreground">Loading your photography collection...</p>
        </header>
        
        {/* Skeleton loader for photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(15).fill(0).map((_, index) => (
            <div key={index} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">
          Photography
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A curated collection of my photography work, capturing moments from travels, nature, and urban landscapes.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          {totalPhotos > 0 && `${totalPhotos} photos • Page ${currentPage} of ${totalPages}`}
        </div>
      </header>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-center">{error}</p>
        </div>
      )}

      {photos && photos.length > 0 ? (
        <>
          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {photos.map((photo, index) => (
              <Card key={photo.id || index} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-0 relative aspect-square">
                  <Image
                    src={photo.src || '/placeholder-image.jpg'}
                    alt={photo.alt || 'Photography image'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={photo.blurDataURL || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite error loops
                      target.src = '/placeholder-image.jpg';
                    }}
                    loading="lazy"
                    fetchPriority="auto"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(photo)}
                        className="bg-white/90 hover:bg-white text-black"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(photo)}
                        className="bg-white/90 hover:bg-white text-black"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Source badge */}
                  {photo.source && (
                    <Badge 
                      variant={photo.source === 'personal' ? 'default' : 'secondary'} 
                      className="absolute top-2 left-2 text-xs"
                    >
                      {photo.source === 'personal' ? 'Personal' : 'Pexels Collection'}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Eye className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No Photos Yet</h3>
            <p className="text-muted-foreground mb-6">
              Your photography collection will appear here once photos are uploaded.
            </p>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-6xl p-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {selectedImage?.title || selectedImage?.alt || 'Photography Image'}
          </DialogTitle>
          {selectedImage && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <Image
                src={selectedImage.downloadUrl || selectedImage.src || '/placeholder-image.jpg'} // Use high resolution version
                alt={selectedImage.alt || 'Photography image'}
                width={1600}
                height={1200}
                className="w-full h-auto max-h-[85vh] object-contain"
                priority
                quality={100} // Maximum quality
                placeholder="blur"
                blurDataURL={selectedImage.blurDataURL || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite error loops
                  target.src = '/placeholder-image.jpg';
                }}
              />
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white border border-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Download button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 bg-black/70 hover:bg-black/90 text-white border border-white/20"
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              {/* Previous button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border border-white/20"
                onClick={handlePreviousPhoto}
                disabled={photos.length <= 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              {/* Next button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border border-white/20"
                onClick={handleNextPhoto}
                disabled={photos.length <= 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Photo counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                {photos.findIndex(photo => photo.id === selectedImage.id) + 1} of {photos.length}
              </div>
              
              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {selectedImage.title || selectedImage.alt}
                    </h3>
                    {selectedImage.photographerName && (
                      <p className="text-white/80 text-sm mb-2">
                        Photo by {selectedImage.photographerName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedImage.source && (
                        <Badge 
                          variant={selectedImage.source === 'personal' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {selectedImage.source === 'personal' ? 'Personal Collection' : 'Pexels Collection'}
                        </Badge>
                      )}
                      {selectedImage.width && selectedImage.height && (
                        <Badge variant="outline" className="text-xs text-white border-white/30">
                          {selectedImage.width} × {selectedImage.height}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Navigation hint */}
                  <div className="text-white/60 text-xs text-right">
                    <p>Use ← → arrow keys</p>
                    <p>Press ESC to close</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
