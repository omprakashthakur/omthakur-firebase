import { notFound } from 'next/navigation';
import Image from 'next/image';
import { blogPosts, categories, allTags } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, Heart } from 'lucide-react';
import Link from 'next/link';
import BlogSidebar from '@/components/blog-sidebar';
import ShareButtons from '@/components/share-buttons';
import CommentSection from '@/components/comment-section';

export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  
  const recentPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <article className="lg:col-span-3">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>

          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg mb-8"
            data-ai-hint="technology blog"
          />

          <div className="prose dark:prose-invert max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: post.content }} />

          <footer className="mt-12">
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag className="h-5 w-5 text-muted-foreground" />
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline">{tag}</Badge>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-b">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Heart className="mr-2 h-4 w-4" /> Like
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#newsletter">Subscribe</Link>
                </Button>
              </div>
              <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
            </div>

            <CommentSection />
          </footer>

        </article>

        <aside className="lg:col-span-1">
          <BlogSidebar
            categories={categories}
            tags={allTags}
            recentPosts={recentPosts}
            currentCategory={post.category}
          />
        </aside>
      </div>
    </div>
  );
}
