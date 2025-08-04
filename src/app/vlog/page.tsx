
import Image from 'next/image';
import Link from 'next/link';
import { type Vlog, vlogCategories, vlogPlatforms } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const platforms = vlogPlatforms;
const categories = vlogCategories;

async function getVlogs() {
    const vlogsCollection = collection(db, 'vlogs');
    const vlogsSnapshot = await getDocs(vlogsCollection);
    return vlogsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Vlog[];
}

export default async function VlogPage() {
  const vlogs = await getVlogs();

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Vlogs</h1>
        <p className="text-xl text-muted-foreground">Stories and experiences, shared through video.</p>
      </header>
      
      <Tabs defaultValue="YouTube" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-1/2 mx-auto">
          {platforms.map(platform => (
            <TabsTrigger key={platform} value={platform}>{platform}</TabsTrigger>
          ))}
        </TabsList>

        {platforms.map(platform => {
          const platformVlogs = vlogs.filter(vlog => vlog.platform === platform);
          return (
            <TabsContent key={platform} value={platform}>
              <div className="mt-12">
                {categories.map(category => {
                  const categoryVlogs = platformVlogs.filter(vlog => vlog.category === category);
                  if (categoryVlogs.length === 0) return null;
                  return (
                    <section key={category} className="mb-12">
                      <h2 className="text-3xl font-headline font-semibold mb-6">{category}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryVlogs.map(vlog => (
                          <Card key={vlog.id} className="group overflow-hidden shadow-lg relative">
                            <Link href={vlog.url} target="_blank" rel="noopener noreferrer" className="block">
                              <Image
                                src={vlog.thumbnail}
                                alt={vlog.title}
                                width={600}
                                height={400}
                                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
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
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  );
}
