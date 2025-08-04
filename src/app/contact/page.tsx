"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { SocialIcons } from "@/components/social-icons";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-headline font-bold text-primary dark:text-primary-foreground mb-4">Contact Me</h1>
        <p className="text-xl text-muted-foreground">I'd love to hear from you. Let's get in touch.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your message..." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary dark:text-accent" />
                <span className="text-muted-foreground">omthakur.dev@email.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-primary dark:text-accent" />
                <span className="text-muted-foreground">+1 (234) 567-890</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary dark:text-accent" />
                <span className="text-muted-foreground">Mumbai, India</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Follow Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-6">
                <Link href="#" aria-label="Facebook"><SocialIcons.Facebook className="h-8 w-8 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Instagram"><SocialIcons.Instagram className="h-8 w-8 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="LinkedIn"><SocialIcons.Linkedin className="h-8 w-8 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="YouTube"><SocialIcons.Youtube className="h-8 w-8 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="GitHub"><SocialIcons.Github className="h-8 w-8 text-muted-foreground hover:text-primary" /></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
