
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import type { BlogPost } from '@/lib/data';
import BlogSidebar from '@/components/blog-sidebar';
import { categories, allTags } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/supabaseClient';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const selectedCategory = searchParams.get('category') as string | undefined;
  const selectedTag = searchParams.get('tag') as string | undefined;
  
  useEffect(() => {
    const fetchData = async () => {
      const allPosts = await getPosts();
      setPosts(allPosts);
      setRecentPosts(allPosts.slice(0, 5));
    }
    fetchData();
  }, []);

  const filteredPosts = posts
    .filter(post => !selectedCategory || post.category === selectedCategory)
    .filter(post => !selectedTag || (post.tags && post.tags.includes(selectedTag)));
  
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">The Blog</h1>
        <p className="text-xl text-muted-foreground">Thoughts on tech, life, and everything in between.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paginatedPosts.map(post => (
              <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href={`/blog/${post.slug}`} className="block relative h-56">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    data-ai-hint="technology blog"
                  />
                </Link>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                       <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                       </div>
                    </div>
                  </div>
                  <CardTitle className="font-headline text-2xl">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button asChild variant="outline" disabled={currentPage <= 1}>
              <Link href={`/blog?page=${currentPage - 1}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}`}>Previous</Link>
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button asChild variant="outline" disabled={currentPage >= totalPages}>
              <Link href={`/blog?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}`}>Next</Link>
            </Button>
          </div>
        </main>
        
        <aside className="lg:col-span-1">
          <BlogSidebar
            categories={categories}
            tags={allTags}
            recentPosts={recentPosts}
            currentCategory={selectedCategory}
            currentTag={selectedTag}
          />
        </aside>
      </div>
    </div>
  );
}
