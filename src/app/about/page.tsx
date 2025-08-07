import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, PenTool, Plane, Camera } from 'lucide-react';

export default function AboutPage() {
  const skills = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Laravel', 'MySQL', 'Docker'];

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary mb-4">About Me</h1>
        <p className="text-xl text-muted-foreground">A glimpse into my world of code, creativity, and curiosity.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <Image
            src="https://images.pexels.com/photos/776656/pexels-photo-776656.jpeg"
            alt="Om Thakur"
            width={400}
            height={400}
            className="rounded-full shadow-lg object-cover"
            data-ai-hint="professional portrait"
          />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-3xl font-headline font-semibold mb-4">Om Thakur</h2>
          <h3 className="text-lg font-semibold text-primary dark:text-accent mb-4">
            Software Engineer | Tech Content Writer | Traveler | Vlogger ▶️ | Photographer 📸
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to my digital space!! I’m Om Thakur, a passionate software engineer with a knack for simplifying complex tech. I share real-world tutorials, project experiences, and current affairs in tech to help others grow. I’m also an avid traveler and content creator, capturing stories through my lens and sharing moments from around the world. Here, you’ll find a blend of technology, videography, photography, and personal insights—all curated with purpose. Let’s connect, learn, and grow together.
          </p>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="text-4xl font-headline font-bold text-center mb-12">My Passions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent p-4 rounded-full w-fit">
                <Cpu className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline mt-4">Software Engineering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Building robust and scalable web applications with modern technologies.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent p-4 rounded-full w-fit">
                <PenTool className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline mt-4">Content Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Writing insightful tech articles and creating engaging video content.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent p-4 rounded-full w-fit">
                <Plane className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline mt-4">Traveling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Exploring new cultures, cuisines, and landscapes around the globe.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent p-4 rounded-full w-fit">
                <Camera className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline mt-4">Photography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Capturing moments and telling stories through the lens of my camera.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* <section className="mt-24">
        <h2 className="text-4xl font-headline font-bold text-center mb-12">Skills & Expertise</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map(skill => (
            <Badge key={skill} variant="secondary" className="text-lg px-4 py-2">{skill}</Badge>
          ))}
        </div>
      </section> */}
    </div>
  );
}
