
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Photography } from '@/lib/data';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPhotographyPage() {
  const [photos, setPhotos] = useState<Photography[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function fetchPhotos() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('photography').select('*');
      if (error) throw error;
      setPhotos(data as Photography[]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch photos: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/photography/${id}`, { method: 'DELETE' });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete photo');
      }
      toast({
        title: 'Success',
        description: 'Photo deleted successfully.',
      });
      fetchPhotos(); // Refresh photo list
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
        <h1 className="text-4xl font-headline font-bold">Photography</h1>
        <Button asChild>
          <Link href="/admin/photography/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Photo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photos.map((photo) => (
                <TableRow key={photo.id}>
                  <TableCell>
                    <Image src={photo.src} alt={photo.alt} width={100} height={100} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{photo.alt}</TableCell>
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
                          <Link href={`/admin/photography/${photo.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(photo.id)} className="text-destructive">
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
