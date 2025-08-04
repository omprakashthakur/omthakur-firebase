"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { SocialIcons } from "./social-icons";


const navLinks = [
  { href: "/", label: "Home" },
  { 
    label: "Blog", 
    isDropdown: true,
    items: [
      { href: "/blog?category=Tech", label: "Tech" },
      { href: "/blog?category=Current+Affairs", label: "Current Affairs" },
      { href: "/blog?category=Personal", label: "Personal" },
    ]
  },
  { href: "/vlog", label: "Vlog" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-primary",
        pathname === href ? "text-primary font-semibold" : "text-muted-foreground"
      )}
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-headline font-bold">
          OmThakur.IO
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => 
            link.isDropdown ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger className={cn(
                  "flex items-center gap-1 transition-colors hover:text-primary focus:outline-none",
                  pathname.startsWith('/blog') ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {link.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link.items?.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  {user &&
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin</Link>
                    </DropdownMenuItem>
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink key={link.label} href={link.href!}>{link.label}</NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-4">
                <Link href="#" aria-label="YouTube"><SocialIcons.Youtube className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Instagram"><SocialIcons.Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Facebook"><SocialIcons.Facebook className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                <Link href="#" aria-label="Linkedin"><SocialIcons.Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                <Link href="#" aria-label="Github"><SocialIcons.Github className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Nav */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="p-6">
                        <nav className="flex flex-col gap-6 text-lg font-medium">
                            {navLinks.map((link) => (
                                <div key={link.label}>
                                    {link.isDropdown ? (
                                        <>
                                            <h4 className="text-muted-foreground font-semibold mb-2">{link.label}</h4>
                                            <div className="flex flex-col gap-4 pl-4">
                                            {link.items?.map((item) => (
                                                <NavLink key={item.label} href={item.href}>{item.label}</NavLink>
                                            ))}
                                             {user && <NavLink href="/admin/dashboard">Admin</NavLink>}
                                            </div>
                                        </>
                                    ) : (
                                        <NavLink href={link.href!}>{link.label}</NavLink>
                                    )}
                                </div>
                            ))}
                        </nav>
                        <div className="mt-8 flex justify-center gap-4">
                            <Link href="#" aria-label="Facebook"><div className="w-8 h-8 rounded-md bg-[#4267B2] flex items-center justify-center"><SocialIcons.Facebook className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="Instagram"><div className="w-8 h-8 rounded-md bg-[#C13584] flex items-center justify-center"><SocialIcons.Instagram className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="LinkedIn"><div className="w-8 h-8 rounded-md bg-[#0077B5] flex items-center justify-center"><SocialIcons.Linkedin className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="YouTube"><div className="w-8 h-8 rounded-md bg-[#FF0000] flex items-center justify-center"><SocialIcons.Youtube className="text-white h-5 w-5"/></div></Link>
                            <Link href="#" aria-label="GitHub"><div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center"><SocialIcons.Github className="text-background h-5 w-5"/></div></Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
