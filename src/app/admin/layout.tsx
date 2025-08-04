
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, BarChart2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Posts', icon: Newspaper },
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
                <span>Back to Site</span>
             </Link>
             <SidebarTrigger />
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
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
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
