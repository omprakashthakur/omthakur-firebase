import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { BlogPost } from '@/lib/data';

interface BlogSidebarProps {
  categories: string[];
  tags: string[];
  recentPosts: Pick<BlogPost, 'slug' | 'title' | 'date'>[];
  currentCategory?: string;
  currentTag?: string;
}

export default function BlogSidebar({
  categories,
  tags,
  recentPosts,
  currentCategory,
  currentTag
}: BlogSidebarProps) {
  return (
    <div className="space-y-8 sticky top-24">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search posts..." />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentPosts.map(post => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="font-semibold text-primary/90 hover:text-primary dark:text-accent-foreground/90 dark:hover:text-accent-foreground transition-colors">
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <Link href="/blog" className={`block p-2 rounded-md ${!currentCategory ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary'}`}>
                All
              </Link>
            </li>
            {categories.map(category => (
              <li key={category}>
                <Link href={`/blog?category=${category}`} className={`block p-2 rounded-md ${currentCategory === category ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary'}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                 <Badge variant={currentTag === tag ? "default" : "secondary"} className="cursor-pointer">{tag}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
