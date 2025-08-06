"use client";

import Image from 'next/image';
import Link from 'next/link';
import { type Vlog, vlogCategories, vlogPlatforms } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, RefreshCw, Youtube, Eye, Clock, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getYouTubeThumbnail } from '@/lib/youtubeThumbnails';
import { generatePlaceholderImage } from '@/lib/utils';

const platforms = vlogPlatforms;
const categories = vlogCategories.filter(cat => cat !== 'All'); // Remove 'All' from filter options

export default function VlogPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vlogs', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000)
      });
      
      const data = await response.json().catch(error => {
        console.error('Error parsing JSON:', error);
        return [];
      });
      
      if (!response.ok) {
        console.warn(`Server returned ${response.status} but we'll use the data anyway`);
      }
      
      setVlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching vlogs:', err);
      setError('Failed to load vlogs. Please try again.');
      setVlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine if a video is a short based on title analysis
  const isVideoShort = (vlog: Vlog): boolean => {
    const title = vlog.title.toLowerCase();
    return title.includes('#shorts') || 
           title.includes('#short') || 
           title.includes('shorts') || 
           title.includes('#reel') || 
           title.includes('#reels');
  };

  // Function to convert platform based on video content
  const getActualPlatform = (vlog: Vlog): Vlog['platform'] => {
    if (vlog.platform === 'YouTube') {
      return isVideoShort(vlog) ? 'YT Shorts' : 'YouTube';
    }
    return vlog.platform;
  };

  // Filter vlogs based on search term and category
  const filterVlogs = (vlogList: Vlog[]) => {
    return vlogList.filter(vlog => {
      const matchesSearch = searchTerm === '' || 
        vlog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vlog.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || vlog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const syncYouTubeVideos = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/youtube/sync?maxResults=10', {
        method: 'GET',
      });
      
      const result = await response.json();
      
      if (result.success) {
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

  return (
    <div className="container mx-auto py-12 px-6">
      <header className="text-center mb-16">
        <h1 className="text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Vlogs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Stories and experiences, shared through video.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            onClick={syncYouTubeVideos}
            disabled={syncing}
            className="inline-flex items-center gap-2"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Youtube className="h-4 w-4" />
            )}
            {syncing ? 'Syncing...' : 'Sync YouTube Videos'}
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search vlogs by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <TabsList className="grid w-full grid-cols-4 md:w-3/4 mx-auto">
            {platforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>
                {platform === 'YT Shorts' ? 'Shorts' : 
                 platform === 'Instagram Reels' ? 'Reels' : platform}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map(platform => {
            // Filter vlogs by platform (with dynamic platform detection)
            const platformVlogs = filterVlogs(vlogs).filter(vlog => {
              const actualPlatform = getActualPlatform(vlog);
              return actualPlatform === platform;
            });

            // Group by category
            const groupedByCategory = categories.reduce((acc, category) => {
              const categoryVlogs = platformVlogs.filter(vlog => vlog.category === category);
              if (categoryVlogs.length > 0) {
                acc[category] = categoryVlogs;
              }
              return acc;
            }, {} as Record<string, Vlog[]>);

            return (
              <TabsContent key={platform} value={platform}>
                <div className="mt-12">
                  {/* Show search results count */}
                  {(searchTerm || selectedCategory !== 'All') && (
                    <div className="mb-6 text-center">
                      <p className="text-muted-foreground">
                        Found {platformVlogs.length} video{platformVlogs.length !== 1 ? 's' : ''} 
                        {searchTerm && ` matching "${searchTerm}"`}
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                      </p>
                    </div>
                  )}

                  {Object.keys(groupedByCategory).length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-xl text-muted-foreground mb-4">
                        No {platform === 'YT Shorts' ? 'Shorts' : platform === 'Instagram Reels' ? 'Reels' : platform} videos found
                      </p>
                      {searchTerm || selectedCategory !== 'All' ? (
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                      ) : (
                        <p className="text-muted-foreground">Check back later for new content</p>
                      )}
                    </div>
                  ) : (
                    Object.entries(groupedByCategory).map(([category, categoryVlogs]) => (
                      <section key={category} className="mb-12">
                        <h2 className="text-3xl font-headline font-semibold mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {categoryVlogs.map(vlog => (
                            <Card key={vlog.id} className="group overflow-hidden shadow-lg relative">
                              <Link href={vlog.url} target="_blank" rel="noopener noreferrer">
                                <div className="relative aspect-video">
                                  <Image
                                    src={vlog.thumbnail || getYouTubeThumbnail(vlog.url) || '/placeholder-image.jpg'}
                                    alt={vlog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                    <PlayCircle className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                  
                                  {/* Platform Badge */}
                                  <div className="absolute top-2 left-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {getActualPlatform(vlog) === 'YouTube' ? (
                                        <Youtube className="h-3 w-3 mr-1" />
                                      ) : null}
                                      {getActualPlatform(vlog)}
                                    </Badge>
                                  </div>

                                  {/* Video Type Badge for Shorts */}
                                  {isVideoShort(vlog) && (
                                    <div className="absolute top-2 right-2">
                                      <Badge variant="destructive" className="text-xs">
                                        SHORT
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                    {vlog.title}
                                  </h3>
                                  
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {vlog.category}
                                    </Badge>
                                    {vlog.view_count && (
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        <span>{vlog.view_count.toLocaleString()}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Link>
                            </Card>
                          ))}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}