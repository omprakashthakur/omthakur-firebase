
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Tech' | 'Current Affairs' | 'Personal';
  tags: string[];
  author: string;
  date: string;
}

export interface Vlog {
  id: number;
  title: string;
  thumbnail: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok';
  url: string;
  category: 'Travel' | 'Tech Talks' | 'Daily Life';
}

export interface Photography {
  id: number;
  src: string;
  alt: string;
  downloadUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mastering-react-hooks',
    title: 'Mastering React Hooks: A Deep Dive',
    excerpt: 'Unlock the full potential of React Hooks. This guide covers everything from useState to custom hooks with practical examples.',
    content: `
<p>React Hooks have revolutionized how we write components. They let you use state and other React features without writing a class. In this post, we'll explore the most common hooks and how to build your own.</p>
<h3 class="font-headline text-2xl font-bold my-4">useState</h3>
<p>The <code>useState</code> hook is the most basic hook. It allows you to add state to functional components. Here's a simple counter example:</p>
<pre><code class="language-javascript">
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
</code></pre>
<h3 class="font-headline text-2xl font-bold my-4">useEffect</h3>
<p>The <code>useEffect</code> hook lets you perform side effects in functional components. It's a close replacement for <code>componentDidMount</code>, <code>componentDidUpdate</code>, and <code>componentWillUnmount</code>.</p>
<img src="https://placehold.co/800x400.png" alt="Code on a screen" class="my-4 rounded-lg" data-ai-hint="code screen" />
<p>This is just the tip of the iceberg. Custom hooks allow you to extract component logic into reusable functions, making your code cleaner and more maintainable.</p>
`,
    image: 'https://placehold.co/600x400.png',
    category: 'Tech',
    tags: ['React', 'JavaScript', 'Web Development'],
    author: 'Om Thakur',
    date: '2024-07-20',
  },
  {
    slug: 'the-rise-of-ai',
    title: 'The Inevitable Rise of Artificial Intelligence',
    excerpt: 'AI is no longer science fiction. We look at the current state of AI, its impact on society, and what the future may hold.',
    content: '<p>Artificial Intelligence is reshaping our world. From healthcare to finance, AI applications are becoming mainstream. This post explores the current landscape and future possibilities.</p>',
    image: 'https://placehold.co/600x400.png',
    category: 'Current Affairs',
    tags: ['AI', 'Technology', 'Future'],
    author: 'Om Thakur',
    date: '2024-07-15',
  },
  {
    slug: 'himalayan-adventure',
    title: 'My Himalayan Adventure: A Personal Journey',
    excerpt: 'A travelogue of my recent trek in the Himalayas. Discover the beauty of the mountains and the lessons I learned along the way.',
    content: '<p>The Himalayas are not just mountains; they are an experience. This is a personal account of my journey, the challenges, and the breathtaking views.</p>',
    image: 'https://placehold.co/600x400.png',
    category: 'Personal',
    tags: ['Travel', 'Adventure', 'Himalayas'],
    author: 'Om Thakur',
    date: '2024-07-10',
  },
  {
    slug: 'nextjs-14-features',
    title: 'Top 5 Features in Next.js 14',
    excerpt: 'Next.js 14 is here with a host of new features. We break down the top 5 updates that will change how you build web applications.',
    content: '<p>With server components, improved routing, and more, Next.js 14 is a game-changer. Let\'s dive into the most impactful new features.</p>',
    image: 'https://placehold.co/600x400.png',
    category: 'Tech',
    tags: ['Next.js', 'Web Development', 'React'],
    author: 'Om Thakur',
    date: '2024-06-28',
  },
];

export const vlogs: Vlog[] = [
  {
    id: 1,
    title: 'Exploring the Streets of Tokyo',
    thumbnail: 'https://placehold.co/600x400.png',
    platform: 'YouTube',
    url: '#',
    category: 'Travel',
  },
  {
    id: 2,
    title: 'My Desk Setup for Productivity',
    thumbnail: 'https://placehold.co/600x400.png',
    platform: 'Instagram',
    url: '#',
    category: 'Tech Talks',
  },
  {
    id: 3,
    title: 'A Day in My Life as a Developer',
    thumbnail: 'https://placehold.co/600x400.png',
    platform: 'TikTok',
    url: '#',
    category: 'Daily Life',
  },
  {
    id: 4,
    title: 'Hiking in the Swiss Alps',
    thumbnail: 'https://placehold.co/600x400.png',
    platform: 'YouTube',
    url: '#',
    category: 'Travel',
  },
];

export const photography: Photography[] = [
  {
    id: 1,
    src: 'https://placehold.co/600x600.png',
    alt: 'Mountain landscape',
    downloadUrl: '#',
  },
  {
    id: 2,
    src: 'https://placehold.co/600x600.png',
    alt: 'City skyline at night',
    downloadUrl: '#',
  },
  {
    id: 3,
    src: 'https://placehold.co/600x600.png',
    alt: 'Forest path in autumn',
    downloadUrl: '#',
  },
  {
    id: 4,
    src: 'https://placehold.co/600x600.png',
    alt: 'Coastal sunset',
    downloadUrl: '#',
  },
  {
    id: 5,
    src: 'https://placehold.co/600x600.png',
    alt: 'Wildlife photography',
    downloadUrl: '#',
  },
  {
    id: 6,
    src: 'https://placehold.co/600x600.png',
    alt: 'Abstract architecture',
    downloadUrl: '#',
  },
  {
    id: 7,
    src: 'https://placehold.co/600x600.png',
    alt: 'Northern Lights',
    downloadUrl: '#',
  },
    {
    id: 8,
    src: 'https://placehold.co/600x600.png',
    alt: 'Desert Dunes',
    downloadUrl: '#',
  },
];

export const categories = ['Tech', 'Current Affairs', 'Personal'];
export const vlogCategories: Vlog['category'][] = ['Travel', 'Tech Talks', 'Daily Life'];
export const vlogPlatforms: Vlog['platform'][] = ['YouTube', 'Instagram', 'TikTok'];
export const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags)));
