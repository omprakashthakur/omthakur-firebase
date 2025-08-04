"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seoOptimizerForBlogPosts, type SEOOptimizerOutput } from "@/ai/flows/seo-optimizer";
import { Loader2, Wand2, Lightbulb } from "lucide-react";
import { categories } from "@/lib/data";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  content: z.string().min(100, "Content must be at least 100 characters."),
  category: z.string({ required_error: "Please select a category." }),
  tags: z.string().min(3, "Please provide at least one tag."),
});

export default function SeoOptimizerPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<SEOOptimizerOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSuggestions(null);
    startTransition(async () => {
      try {
        const result = await seoOptimizerForBlogPosts(values);
        setSuggestions(result);
      } catch (error) {
        console.error("Error optimizing SEO:", error);
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get SEO suggestions. Please try again.",
        });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <Wand2 className="h-12 w-12 mx-auto text-primary dark:text-accent mb-4" />
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">AI SEO Optimizer</h1>
        <p className="text-xl text-muted-foreground">Get AI-powered suggestions to boost your blog post's ranking.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Blog Post Details</CardTitle>
            <CardDescription>Fill in the details of your blog post below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Your blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React, Next.js, AI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your blog post content here..." {...field} rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Get SEO Suggestions
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">SEO Suggestions</CardTitle>
              <CardDescription>Suggestions will appear here after you submit your content.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPending && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Analyzing your content...</p>
                </div>
              )}
              {suggestions && (
                <ul className="space-y-4">
                  {suggestions.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 mt-1 text-primary dark:text-accent flex-shrink-0" />
                      <span className="text-foreground">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!isPending && !suggestions && (
                 <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Lightbulb className="h-10 w-10 mb-4" />
                  <p className="text-center">Your SEO tips are just a click away!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
