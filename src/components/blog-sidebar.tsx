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
    { name: 'Instagram', icon: <SocialIcons.Instagram className="text-white" />, url: '#', color: 'bg-[#C13584]' },
    { name: 'Twitter', icon: <SocialIcons.Twitter className="text-white" />, url: '#', color: 'bg-[#1DA1F2]' },
    { name: 'Facebook', icon: <SocialIcons.Facebook className="text-white" />, url: '#', color: 'bg-[#4267B2]' },
    { name: 'Youtube', icon: <SocialIcons.Youtube className="text-white" />, url: '#', color: 'bg-[#FF0000]' },
    { name: 'Pinterest', icon: <SocialIcons.Pinterest className="text-white" />, url: '#', color: 'bg-[#E60023]' },
    { name: 'Linkedin', icon: <SocialIcons.Linkedin className="text-white" />, url: '#', color: 'bg-[#0077B5]' },
];

const categoryIcons = {
    'Tech': <Code className="h-4 w-4 text-white" />,
    'Current Affairs': <Newspaper className="h-4 w-4 text-white" />,
    'Personal': <User className="h-4 w-4 text-white" />
} as const;

const categoryColors = {
    'Tech': 'bg-pink-500',
    'Current Affairs': 'bg-orange-500',
    'Personal': 'bg-blue-500',
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
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${network.color}`}>
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
             <Link href={`/blog?category=${category}`} key={category} className="block relative h-24 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
                <Image src="https://placehold.co/400x200.png" alt={category} layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-500" data-ai-hint="landscape abstract" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                       <div className={`p-2 rounded-md ${categoryColors[category]}`}>
                         {categoryIcons[category]}
                       </div>
                       <span className="font-bold text-lg text-foreground">{category}</span>
                    </div>
                </div>
             </Link>
          ))}
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
