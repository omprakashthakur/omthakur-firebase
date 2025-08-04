"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rss } from "lucide-react";
import { SocialIcons } from "./social-icons";


export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
      return null;
    }

    return (
        <footer className="bg-secondary/50 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="lg:col-span-1">
                        <h3 className="font-headline text-2xl font-semibold mb-4">OmThakur.IO</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            A digital space for technology, creativity, and personal growth.
                        </p>
                         <div className="flex space-x-3">
                            <Link href="#" aria-label="Facebook"><div className="w-8 h-8 rounded-md bg-[#4267B2] flex items-center justify-center"><SocialIcons.Facebook className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="Instagram"><div className="w-8 h-8 rounded-md bg-[#C13584] flex items-center justify-center"><SocialIcons.Instagram className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="LinkedIn"><div className="w-8 h-8 rounded-md bg-[#0077B5] flex items-center justify-center"><SocialIcons.Linkedin className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="YouTube"><div className="w-8 h-8 rounded-md bg-[#FF0000] flex items-center justify-center"><SocialIcons.Youtube className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="GitHub"><div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center"><SocialIcons.Github className="text-background h-5 w-5"/></div></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Me</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                            <li><Link href="/photography" className="text-muted-foreground hover:text-primary">Photography</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>
                     {/* Categories */}
                    <div>
                        <h4 className="font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/blog?category=Tech" className="text-muted-foreground hover:text-primary">Tech</Link></li>
                            <li><Link href="/blog?category=Current+Affairs" className="text-muted-foreground hover:text-primary">Current Affairs</Link></li>
                            <li><Link href="/blog?category=Personal" className="text-muted-foreground hover:text-primary">Personal</Link></li>
                             <li><Link href="/vlog?category=Travel" className="text-muted-foreground hover:text-primary">Travel Vlogs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4">Newsletter</h4>
                        <p className="text-muted-foreground text-sm mb-4">Subscribe for latest blog updates, vlogs, and exclusive photography.</p>
                        <form className="flex gap-2">
                            <Input type="email" placeholder="Your email address" className="bg-background" />
                            <Button type="submit"><Rss className="h-4 w-4"/></Button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} OmThakur.IO. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
