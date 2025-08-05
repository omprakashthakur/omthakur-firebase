
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Vlog } from '@/lib/data';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';


export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id: string) => {
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
        <h1 className="text-4xl font-headline font-bold">Vlogs</h1>
        <Button asChild>
          <Link href="/admin/vlogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Vlog
          </Link>
        </Button>
      </div>

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
                    <Image src={vlog.thumbnail} alt={vlog.title} width={80} height={45} className="rounded-md object-cover" />
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
