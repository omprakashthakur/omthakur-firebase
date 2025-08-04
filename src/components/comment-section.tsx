"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";

const commentSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

const mockComments = [
  {
    author: "Jane Doe",
    avatar: "https://placehold.co/100x100.png",
    date: "2 days ago",
    text: "This is an incredibly insightful article! Thanks for sharing.",
  },
  {
    author: "John Smith",
    avatar: "https://placehold.co/100x100.png",
    date: "1 day ago",
    text: "Great read! I learned a lot about custom hooks.",
  },
];

export default function CommentSection() {
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { name: "", comment: "" },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    console.log(values);
    form.reset();
  }
  
  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Comments ({mockComments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockComments.map((comment, index) => (
              <div key={index} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.author} data-ai-hint="person avatar" />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <p className="text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-headline text-xl font-semibold mb-4">Leave a Comment</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Write your comment here..." {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Post Comment</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
