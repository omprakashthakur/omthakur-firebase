
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, BarChart2, Video, Camera, User } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Posts', icon: Newspaper },
    { href: '/admin/vlogs', label: 'Vlogs', icon: Video },
    { href: '/admin/photography', label: 'Photography', icon: Camera },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center justify-between">
             <Link href="/" className="font-headline font-bold text-lg flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Home className="w-5 h-5" />
                </Button>
                <span className="group-data-[collapsible=icon]:hidden">Back to Site</span>
             </Link>
             <SidebarTrigger className="group-data-[collapsible=icon]:hidden"/>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/profile'} tooltip={{children: "Profile"}}>
                  <Link href="/admin/profile">
                    <Avatar className="size-6">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Om Thakur" data-ai-hint="person avatar" />
                        <AvatarFallback>OT</AvatarFallback>
                    </Avatar>
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
