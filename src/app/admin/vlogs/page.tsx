
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Youtube, RefreshCw, Settings, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Vlog } from '@/lib/data';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';
import { getYouTubeThumbnail } from '@/lib/youtubeThumbnails';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SyncResult {
  success: boolean;
  message: string;
  syncedVideos: number;
  totalFetched: number;
  videos?: Array<{
    id: string;
    title: string;
    category: string;
    url: string;
    created_at: string;
  }>;
}


export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [maxResults, setMaxResults] = useState(10);
  const [forceSync, setForceSync] = useState(false);
  const { toast } = useToast();

  async function fetchVlogs() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('vlogs').select('*');
      if (error) throw error;
      setVlogs(data as Vlog[]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch vlogs: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVlogs();
  }, []);

  const syncYouTubeVideos = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);
      
      const url = `/api/youtube/sync?maxResults=${maxResults}&forceSync=${forceSync}`;
      const response = await fetch(url);
      const result = await response.json();
      
      setSyncResult(result);
      
      if (result.success && result.syncedVideos > 0) {
        // Refresh the vlogs list
        await fetchVlogs();
        toast({
          title: 'Success',
          description: `Synced ${result.syncedVideos} YouTube videos`,
        });
      }
    } catch (error) {
      console.error('Error syncing YouTube videos:', error);
      setSyncResult({
        success: false,
        message: 'Failed to sync YouTube videos',
        syncedVideos: 0,
        totalFetched: 0
      });
    } finally {
      setSyncing(false);
    }
  };

  const testYouTubeConnection = async () => {
    try {
      const response = await fetch('/api/youtube/videos?maxResults=1');
      const result = await response.json();
      
      if (result.success) {
        setSyncResult({
          success: true,
          message: `✓ YouTube API connection successful! Found ${result.count} videos.`,
          syncedVideos: 0,
          totalFetched: result.count
        });
        toast({
          title: 'Connection Successful',
          description: 'YouTube API is working correctly',
        });
      } else {
        setSyncResult({
          success: false,
          message: result.message || 'YouTube API connection failed',
          syncedVideos: 0,
          totalFetched: 0
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: 'Failed to test YouTube connection',
        syncedVideos: 0,
        totalFetched: 0
      });
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this vlog?')) return;

    try {
      const response = await fetch(`/api/vlogs/${id}`, { method: 'DELETE' });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete vlog');
      }
      toast({
        title: 'Success',
        description: 'Vlog deleted successfully.',
      });
      fetchVlogs(); // Refresh vlogs list
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };
  
  if (loading) {
      return <div className="flex h-[50vh] w-full items-center justify-center"><Spinner /></div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-headline font-bold">Vlogs</h1>
          <p className="text-muted-foreground">Manage your vlogs and sync with YouTube</p>
        </div>
        <Button asChild>
          <Link href="/admin/vlogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Vlog
          </Link>
        </Button>
      </div>

      {/* YouTube Sync Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sync Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxResults">Max Videos to Sync</Label>
              <Input
                id="maxResults"
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
                min="1"
                max="50"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="forceSync"
                checked={forceSync}
                onChange={(e) => setForceSync(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="forceSync" className="text-sm">
                Force sync (re-sync existing videos)
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={testYouTubeConnection}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Test Connection
            </Button>
            
            <Button 
              onClick={syncYouTubeVideos}
              disabled={syncing}
              className="flex items-center gap-2"
            >
              {syncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {syncing ? 'Syncing...' : 'Sync YouTube Videos'}
            </Button>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <Alert className={syncResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2 mb-2">
                  {syncResult.success ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={syncResult.success ? 'text-green-800' : 'text-red-800'}>
                    {syncResult.message}
                  </span>
                </div>
                
                {syncResult.syncedVideos > 0 && syncResult.videos && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Synced Videos:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      {syncResult.videos.map((video, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          {video.title}
                          <Badge variant="outline" className="text-xs">
                            {video.category}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Vlogs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vlogs.map((vlog) => (
                <TableRow key={vlog.id}>
                  <TableCell>
                    <div className="relative w-[80px] h-[45px] rounded-md overflow-hidden">
                      <Image 
                        src={
                          vlog.platform === 'YouTube' && vlog.url
                            ? getYouTubeThumbnail(vlog.url)
                            : (vlog.thumbnail || "https://placehold.co/800x450")
                        } 
                        alt={vlog.title} 
                        width={80} 
                        height={45} 
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vlog.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vlog.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{vlog.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/vlogs/${vlog.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(vlog.id)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
