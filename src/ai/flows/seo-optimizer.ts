// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Provides AI-driven SEO suggestions for blog posts.
 *
 * - seoOptimizerForBlogPosts - A function that provides SEO suggestions for blog posts.
 * - SEOOptimizerInput - The input type for the seoOptimizerForBlogPosts function.
 * - SEOOptimizerOutput - The return type for the seoOptimizerForBlogPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SEOOptimizerInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The content of the blog post.'),
  category: z.string().describe('The category of the blog post.'),
  tags: z.string().describe('The tags associated with the blog post.'),
});
export type SEOOptimizerInput = z.infer<typeof SEOOptimizerInputSchema>;

const SEOOptimizerOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('SEO suggestions for the blog post.')
  ).describe('A list of SEO suggestions to improve the blog post ranking.'),
});
export type SEOOptimizerOutput = z.infer<typeof SEOOptimizerOutputSchema>;

export async function seoOptimizerForBlogPosts(input: SEOOptimizerInput): Promise<SEOOptimizerOutput> {
  return seoOptimizerFlow(input);
}

const seoOptimizerPrompt = ai.definePrompt({
  name: 'seoOptimizerPrompt',
  input: {schema: SEOOptimizerInputSchema},
  output: {schema: SEOOptimizerOutputSchema},
  prompt: `You are an SEO expert. Provide SEO suggestions to improve the ranking of the following blog post.

Title: {{{title}}}
Content: {{{content}}}
Category: {{{category}}}
Tags: {{{tags}}}

SEO Suggestions:
`,
});

const seoOptimizerFlow = ai.defineFlow(
  {
    name: 'seoOptimizerFlow',
    inputSchema: SEOOptimizerInputSchema,
    outputSchema: SEOOptimizerOutputSchema,
  },
  async input => {
    const {output} = await seoOptimizerPrompt(input);
    return output!;
  }
);
