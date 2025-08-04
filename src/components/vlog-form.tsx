
"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { vlogCategories, vlogPlatforms } from '@/lib/data';
import type { Vlog } from '@/lib/data';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  url: z.string().url('Please enter a valid URL.'),
  platform: z.enum(vlogPlatforms, { required_error: 'Please select a platform.' }),
  category: z.enum(vlogCategories, { required_error: 'Please select a category.' }),
});

interface VlogFormProps {
  vlog?: Vlog;
}

export default function VlogForm({ vlog }: VlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!vlog;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: vlog?.title || '',
      url: vlog?.url || '',
      platform: vlog?.platform,
      category: vlog?.category,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/vlogs/${vlog.id}` : '/api/vlogs';
    
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
        title: `Vlog ${isEditing ? 'updated' : 'created'}`,
        description: `Your vlog has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });

      router.push('/admin/vlogs');
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vlog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vlog URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vlogPlatforms.map(platform => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vlogCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
            <Button type="submit">{isEditing ? 'Update Vlog' : 'Create Vlog'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
