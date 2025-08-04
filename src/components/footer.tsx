"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Instagram, Linkedin, Rss, Twitter, Youtube } from "lucide-react";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.528 8.003c-.22.282-.41.61-.55.954-.14.344-.21.713-.21 1.093v6.23a1.44 1.44 0 0 1-1.44 1.44h-2.88a1.44 1.44 0 0 1-1.44-1.44v-2.88a1.44 1.44 0 0 1 1.44-1.44h.029c.282.22.61.41.954.55.344.14.713.21 1.093.21v-6.23a1.44 1.44 0 0 1 1.44-1.44h2.88a1.44 1.44 0 0 1 1.44 1.44v2.88a1.44 1.44 0 0 1-1.44 1.44h-.029c-.282-.22-.61-.41-.954-.55-.344-.14-.713-.21-1.093-.21z"></path>
    </svg>
);


export default function Footer() {
    return (
        <footer className="bg-secondary/50 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="md:col-span-1">
                        <h3 className="font-headline text-2xl font-semibold mb-2">OmThakur.IO</h3>
                        <p className="text-muted-foreground text-sm">
                            A digital space for technology, creativity, and personal growth.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Me</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Advertise</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-semibold mb-4">Socials</h4>
                        <div className="flex space-x-4">
                            <Link href="#" aria-label="Facebook"><Facebook className="text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#" aria-label="Instagram"><Instagram className="text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#" aria-label="LinkedIn"><Linkedin className="text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#" aria-label="TikTok"><TikTokIcon className="text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#" aria-label="YouTube"><Youtube className="text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#" aria-label="GitHub"><Github className="text-muted-foreground hover:text-primary" /></Link>
                        </div>
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
