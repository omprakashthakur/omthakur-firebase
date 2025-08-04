
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/data';
import type { BlogPost } from '@/lib/data';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters.'),
  content: z.string().min(100, 'Content must be at least 100 characters.'),
  category: z.string({ required_error: 'Please select a category.' }),
  tags: z.string().min(2, 'Please provide at least one tag.'),
  image: z.string().url("Image must be a valid URL.").optional().or(z.literal('')),
});

interface PostFormProps {
  post?: BlogPost;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      category: post?.category || '',
      tags: post?.tags?.join(', ') || '',
      image: post?.image || '',
    },
  });

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/posts/${post.slug}` : '/api/posts';

    const postData = {
      ...values,
      slug: isEditing ? post.slug : slugify(values.title),
      tags: values.tags.split(',').map(tag => tag.trim()),
      author: 'Om Thakur', // This would typically come from user session
      date: post?.date || new Date().toISOString(),
      image: values.image || 'https://placehold.co/1200x600.png', // Default placeholder
    };
    
    // In edit mode, we only send the changed values
    const payload = isEditing ? {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        tags: values.tags.split(',').map(tag => tag.trim()),
        image: values.image,
    } : postData;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      toast({
        title: `Post ${isEditing ? 'updated' : 'created'}`,
        description: `Your post has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });

      router.push('/admin/dashboard');
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
    <Card className="max-w-4xl mx-auto">
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
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                            <Input 
                              placeholder="https://example.com/your-image.png"
                              {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            You can upload your image to a free hosting service and paste the URL here.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short summary of the post" {...field} />
                  </FormControl>
                  <FormDescription>This will be shown on the blog listing page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your post content here. You can use HTML." {...field} rows={15} />
                  </FormControl>
                   <FormDescription>You can use basic HTML tags for formatting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React, Next.js, AI" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
            <Button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
