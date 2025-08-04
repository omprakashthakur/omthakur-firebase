import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Code, Newspaper, User } from 'lucide-react';
import type { BlogPost } from '@/lib/data';
import { SocialIcons } from '@/components/social-icons';
import Image from 'next/image';

interface BlogSidebarProps {
  categories: string[];
  tags: string[];
  recentPosts: Pick<BlogPost, 'slug' | 'title' | 'date'>[];
  currentCategory?: string;
  currentTag?: string;
}

const socialNetworks = [
  { name: 'Instagram', icon: <SocialIcons.Instagram />, url: '#' },
  { name: 'Twitter', icon: <SocialIcons.Twitter />, url: '#' },
  { name: 'Facebook', icon: <SocialIcons.Facebook />, url: '#' },
  { name: 'Youtube', icon: <SocialIcons.Youtube />, url: '#' },
  { name: 'Pinterest', icon: <SocialIcons.Pinterest />, url: '#' },
  { name: 'Linkedin', icon: <SocialIcons.Linkedin />, url: '#' },
];

const categoryIcons = {
    'Tech': <Code className="h-6 w-6 text-accent-foreground" />,
    'Current Affairs': <Newspaper className="h-6 w-6 text-accent-foreground" />,
    'Personal': <User className="h-6 w-6 text-accent-foreground" />
} as const;


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
          <CardTitle className="font-headline">Search</CardTitle>
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
          <CardTitle className="font-headline">Social Networks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {socialNetworks.map((network) => (
            <Link key={network.name} href={network.url} className="flex items-center gap-3 rounded-lg bg-secondary/70 p-3 transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-secondary/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/70">
                  {network.icon}
                </div>
                <span className="font-semibold text-sm">{network.name}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(categories as Array<keyof typeof categoryIcons>).map((category) => (
             <Link href={`/blog?category=${category}`} key={category}>
                <div className="relative overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300" />
                    <div className="p-4 flex items-center gap-4">
                       <div className="p-3 rounded-lg bg-accent/80 dark:bg-accent/50">
                         {categoryIcons[category]}
                       </div>
                       <span className="font-bold text-lg">{category}</span>
                    </div>
                </div>
             </Link>
          ))}
           <Link href="/blog">
                <div className="relative overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-muted/20 dark:from-secondary/10 dark:to-muted/10 group-hover:from-secondary/30 group-hover:to-muted/30 transition-all duration-300" />
                     <div className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-muted/80 dark:bg-muted/50">
                           <Newspaper className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="font-bold text-lg">All Categories</span>
                    </div>
                </div>
             </Link>
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
          <CardTitle className="font-headline">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                 <Badge variant={currentTag === tag ? "default" : "secondary"} className="cursor-pointer text-base py-1 px-3 rounded-full hover:shadow-md transition-shadow">{tag}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
