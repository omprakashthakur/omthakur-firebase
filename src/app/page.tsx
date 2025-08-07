
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost, Photography, Vlog } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function Home() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [featuredVlogs, setFeaturedVlogs] = useState<Vlog[]>([]);
  const [photoGallery, setPhotoGallery] = useState<Photography[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog posts
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);
        
        if (postsError) {
          console.error('Error fetching posts:', postsError);
        } else {
          console.log('Posts fetched successfully:', posts);
          setRecentPosts(posts || []);
        }

        // Fetch vlogs - only long format videos for featured section
        const { data: vlogs, error: vlogsError } = await supabase
          .from('vlogs')
          .select('*')
          .neq('platform', 'YT Shorts') // Exclude YouTube Shorts
          .limit(3);
        
        if (vlogsError) {
          console.error('Error fetching vlogs:', vlogsError);
        } else {
          // Additional client-side filtering for videos that might be shorts based on title
          const longVideos = vlogs?.filter((vlog: Vlog) => {
            const title = vlog.title.toLowerCase();
            const isShort = title.includes('#shorts') || 
                          title.includes('#short') || 
                          title.includes('shorts') || 
                          title.includes('#reel') || 
                          title.includes('#reels');
            return !isShort; // Only include non-short videos
          }) || [];
          
          console.log('Long vlogs fetched successfully:', longVideos);
          setFeaturedVlogs(longVideos);
        }

        // Fetch photos
        const { data: photos, error: photosError } = await supabase
          .from('photography')
          .select('*')
          .limit(6);
        
        if (photosError) {
          console.error('Error fetching photos:', photosError);
        } else {
          console.log('Photos fetched successfully:', photos);
          setPhotoGallery(photos || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary dark:text-primary">Om Thakur</h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                    Software Engineer | Tech Content Writer | Traveler | Vlogger ▶️ | Photographer 📸
                </p>
                <div className="mt-8 flex justify-center md:justify-start gap-4">
                    <Button asChild size="lg">
                    <Link href="/blog">Read The Blog</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                    <Link href="/about">About Me</Link>
                    </Button>
                </div>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-lg shadow-2xl overflow-hidden">
                <Image
                    src="https://images.pexels.com/photos/33059766/pexels-photo-33059766.png"
                    alt="Woman working on a computer"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="w-full h-full object-cover"
                    data-ai-hint="woman technology computer"
                />
            </div>
        </div>
      </section>
      
      {/* About Me Snippet */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto text-center p-8 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <h2 className="text-3xl font-headline font-semibold">Welcome to my digital space!</h2>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                    I’m Om Thakur, a passionate software engineer with a knack for simplifying complex tech. I share real-world tutorials, project experiences, and current affairs in tech to help others grow. I’m also an avid traveler and content creator, capturing stories through my lens and sharing moments from around the world. Here, you’ll find a blend of technology, videography, photography, and personal insights—all curated with purpose. Let’s connect, learn, and grow together.
                    </p>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Recent Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts && recentPosts.length > 0 ? recentPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href={`/blog/${post.slug}`} className="block relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint="technology blog"
                  />
                </Link>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <CardTitle className="mt-2 font-headline text-xl">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            )) : (
              <div className="col-span-1 md:col-span-3 text-center py-8">
                <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Vlogs */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Featured Vlogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVlogs && featuredVlogs.length > 0 ? featuredVlogs.map((vlog) => (
              <Card key={vlog.id} className="group overflow-hidden shadow-lg relative">
                <Link href={vlog.url} target="_blank" rel="noopener noreferrer" className="block relative h-60">
                  <Image
                    src={vlog.thumbnail}
                    alt={vlog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="travel vlog"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                </Link>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-headline text-lg text-white">{vlog.title}</h3>
                  <Badge variant="default" className="mt-1">{vlog.platform}</Badge>
                </div>
              </Card>
            )) : (
              <div className="col-span-1 md:col-span-3 text-center py-8">
                <p className="text-muted-foreground">No vlogs found. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photography Highlights */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Photography</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {photoGallery && photoGallery.length > 0 ? photoGallery.map((photo, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <Link href="/photography" className="relative block w-full h-full">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              data-ai-hint="travel photography"
                            />
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                )) : (
                  <CarouselItem className="basis-full">
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground">No photos found. Check back soon!</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
             <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/photography">View Gallery</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
