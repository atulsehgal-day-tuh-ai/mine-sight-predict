
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AppNavigation } from '@/components/minesight/app-navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PanelLeft, History, ListChecks, Brain } from 'lucide-react';

const dashboardSections = [
  {
    title: 'Accidentes Históricos',
    description: 'Analice incidentes pasados y el desempeño de seguridad por área.',
    href: '/historical-accidents',
    icon: History,
  },
  {
    title: 'Resumen de Riesgos del Sitio',
    description: 'Vea los niveles de riesgo por área y los factores contribuyentes.',
    href: '/summary',
    icon: ListChecks,
  },
  {
    title: 'Asesor Estratégico de Seguridad',
    description: 'Obtenga recomendaciones de IA para la toma de decisiones estratégicas.',
    href: '/strategic-advisor',
    icon: Brain,
  },
];

export default function DashboardPage() {
  const pageTitle = "Panel Principal - Day-tuh.ai Guardián";

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r shadow-md">
        <SidebarHeader>
          <AppNavigation />
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border" />
        <SidebarContent className="p-0" />
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Alternar Barra Lateral</span>
          </SidebarTrigger>
          <h1 className="text-lg font-semibold text-foreground flex-1">
            {pageTitle}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="items-center md:items-start text-center md:text-left">
              {/* 
                To use your actual logo image:
                1. Save your logo image (e.g., day-tuh-logo.png) into the `public` folder of your project.
                2. Change the `src` attribute below from "https://placehold.co/240x64.png" to "/day-tuh-logo.png" (or your file's name).
                3. Adjust `width` and `height` to your logo's actual dimensions.
              */}
              {/* 
              <Image
                src="https://placehold.co/240x64.png" 
                alt="Day-tuh.ai - navigate the unknown"
                width={240} 
                height={64}
                className="mb-4"
                data-ai-hint="brand logo"
                priority 
              />
              */}
              <CardTitle className="text-4xl font-extrabold text-foreground mb-1">
                Day-tuh.ai
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mb-3">
                navigate the unknown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold text-primary mb-2">Bienvenido a Guardián</h2>
              <p className="text-md text-foreground/90 mb-4">
                Day-tuh.ai Guardián es su plataforma integral para el análisis predictivo de seguridad en operaciones mineras. Explore nuestros módulos para analizar datos históricos, evaluar riesgos actuales y recibir recomendaciones estratégicas asistidas por IA, todo diseñado para fomentar un entorno de trabajo más seguro y productivo.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link href={section.href} key={section.href} legacyBehavior passHref>
                  <Card className="shadow-lg rounded-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full group">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                       <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Icon className="h-8 w-8" />
                       </div>
                       <CardTitle className="text-xl group-hover:text-primary transition-colors">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
