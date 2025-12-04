
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLogo } from '@/components/minesight/app-logo';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, History, ListChecks, Brain } from 'lucide-react'; 

export function AppNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Panel Principal', icon: LayoutDashboard },
    { href: '/historical-accidents', label: 'Accidentes Históricos', icon: History },
    { href: '/summary', label: 'Resumen de Riesgos', icon: ListChecks },
    { href: '/strategic-advisor', label: 'Asesor Estratégico', icon: Brain },
  ];

  return (
    <div>
      <AppLogo />
      <SidebarMenu className="px-2 py-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href} 
                className="w-full justify-start"
                tooltip={item.label}
              >
                <a>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
