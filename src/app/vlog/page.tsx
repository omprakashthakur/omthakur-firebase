"use client";

import Image from 'next/image';
import Link from 'next/link';
import { type Vlog, vlogCategories, vlogPlatforms } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayCircle, RefreshCw, Youtube, Eye, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getYouTubeThumbnail } from '@/lib/youtubeThumbnails';
import { generatePlaceholderImage } from '@/lib/utils';

const platforms = vlogPlatforms;
const categories = vlogCategories;

export default function VlogPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    try {
      setLoading(true);
      // Use the API endpoint instead of direct Supabase access
      // Removed the order parameter to avoid potential issues
      const response = await fetch('/api/vlogs', {
        // Add cache: 'no-store' to prevent caching issues during development
        cache: 'no-store',
        // Set a timeout to prevent hanging requests
        signal: AbortSignal.timeout(8000)
      });
      
      // Get response data whether or not the response is ok
      // Our API now returns placeholder data instead of errors
      const data = await response.json().catch(error => {
        console.error('Error parsing JSON:', error);
        return []; // Return empty array if JSON parsing fails
      });
      
      if (!response.ok) {
        console.warn(`Server returned ${response.status} but we'll use the data anyway`);
      }
      
      // Ensure we always have an array to work with
      setVlogs(Array.isArray(data) ? data : []);
      
      // Only set error if we have no data to display
      if (!Array.isArray(data) || data.length === 0) {
        setError('No vlogs available at this time');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching vlogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vlogs');
      // Don't clear the vlogs array if we already have data
      if (vlogs.length === 0) {
        setVlogs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual YouTube sync function
  const syncYouTubeVideos = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/youtube/sync?maxResults=10', {
        method: 'GET',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh vlogs after successful sync
        await fetchVlogs();
        console.log('YouTube sync successful:', result.message);
      } else {
        console.error('YouTube sync failed:', result.message);
        setError(result.message || 'Failed to sync YouTube videos');
      }
    } catch (err) {
      console.error('Error syncing YouTube videos:', err);
      setError('Failed to sync YouTube videos');
    } finally {
      setSyncing(false);
    }
  };

  // Format duration from ISO 8601 format (PT4M13S) to readable format
  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format view count
  const formatViewCount = (viewCount?: number) => {
    if (!viewCount) return '';
    
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M views`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K views`;
    }
    return `${viewCount} views`;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Vlogs</h1>
        <p className="text-xl text-muted-foreground mb-6">Stories and experiences, shared through video.</p>
        
        {/* YouTube Sync Button */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={syncYouTubeVideos} 
            disabled={syncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Youtube className="h-4 w-4" />
            )}
            {syncing ? 'Syncing...' : 'Sync YouTube Videos'}
          </Button>
        </div>
      </header>
      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-8">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && vlogs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">No vlogs found</p>
          <p className="text-muted-foreground">Check back later for new content</p>
        </div>
      )}
      
      {!loading && !error && vlogs.length > 0 && (
        <Tabs defaultValue={platforms[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-1/2 mx-auto">
            {platforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>{platform}</TabsTrigger>
            ))}
          </TabsList>

          {platforms.map(platform => {
            const platformVlogs = vlogs.filter(vlog => vlog.platform === platform);
            return (
              <TabsContent key={platform} value={platform}>
                <div className="mt-12">
                  {categories.map(category => {
                    const categoryVlogs = platformVlogs.filter(vlog => vlog.category === category);
                    if (categoryVlogs.length === 0) return null;
                    return (
                      <section key={category} className="mb-12">
                        <h2 className="text-3xl font-headline font-semibold mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {categoryVlogs.map(vlog => (
                            <Card key={vlog.id} className="group overflow-hidden shadow-lg relative">
                              <Link href={vlog.url} target="_blank" rel="noopener noreferrer">
                                <div className="relative aspect-video">
                                  <Image
                                    src={
                                      vlog.platform === 'YouTube' && vlog.url
                                        ? getYouTubeThumbnail(vlog.url)
                                        : (vlog.thumbnail || "https://placehold.co/800x450")
                                    }
                                    alt={vlog.title}
                                    className="object-cover"
                                    fill
                                    priority
                                    onError={(e) => {
                                      // Fallback to a local placeholder if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null; // Prevent infinite loop
                                      
                                      // For YouTube, try a lower quality thumbnail before giving up
                                      if (vlog.platform === 'YouTube' && vlog.url && target.src.includes('maxresdefault')) {
                                        target.src = vlog.url.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                      } else {
                                        target.src = generatePlaceholderImage(800, 450, `${vlog.platform} - ${vlog.title}`, '#1a1a1a', '#ffffff');
                                        target.style.opacity = '0.9';
                                      }
                                    }}
                                  />
                                  
                                  {/* Video duration overlay */}
                                  {vlog.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
                                      {formatDuration(vlog.duration)}
                                    </div>
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <PlayCircle className="h-16 w-16 text-white" />
                                </div>
                              </Link>
                              
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-headline text-lg line-clamp-2 flex-1">{vlog.title}</h3>
                                </div>
                                
                                {/* Video description */}
                                {vlog.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                    {vlog.description}
                                  </p>
                                )}
                                
                                {/* Video metadata */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge 
                                      variant={vlog.platform === 'YouTube' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {vlog.platform}
                                    </Badge>
                                    {vlog.view_count && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Eye className="h-3 w-3" />
                                        {formatViewCount(vlog.view_count)}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {vlog.created_at && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {new Date(vlog.created_at).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
