
"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Photography } from '@/lib/data';

const formSchema = z.object({
  src: z.string().url('Please enter a valid image URL.'),
  alt: z.string().min(5, 'Alt text must be at least 5 characters.'),
  downloadUrl: z.string().url('Please enter a valid download URL.'),
});

interface PhotographyFormProps {
  photo?: Photography;
}

export default function PhotographyForm({ photo }: PhotographyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!photo;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      src: photo?.src || '',
      alt: photo?.alt || '',
      downloadUrl: photo?.downloadUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/photography/${photo.id}` : '/api/photography';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      toast({
        title: `Photo ${isEditing ? 'updated' : 'added'}`,
        description: `The photo has been successfully ${isEditing ? 'updated' : 'added'}.`,
      });

      router.push('/admin/photography');
      router.refresh();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message,
      });
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="src"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/600x600.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="A descriptive caption for the image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downloadUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Download URL</FormLabel>
                  <FormControl>
                    <Input placeholder="A link to download the high-resolution image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{isEditing ? 'Update Photo' : 'Add Photo'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
