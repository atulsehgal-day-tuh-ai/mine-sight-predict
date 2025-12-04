
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Map } from 'lucide-react';

// No props needed if risks are not passed
interface MineSiteMapDisplayProps {}

export function MineSiteMapDisplay({}: MineSiteMapDisplayProps) {
  const labelTextStyle = { fontFamily: "sans-serif", fontSize: "10px", fontWeight: "medium", fill: "hsl(var(--foreground))" };
  const labelBgStyle = { fill: "hsl(var(--background))", stroke: "hsl(var(--foreground))", strokeWidth: "0.5", rx:"2" };

  return (
    <Card className="shadow-lg rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map className="h-6 w-6 text-primary" />
          Esquema General del Sitio Minero
        </CardTitle>
        <CardDescription>
          Mapa esquemático de las áreas operativas clave.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4 flex-grow">
        <svg 
          width="100%" 
          height="auto" 
          viewBox="0 0 550 400" 
          xmlns="http://www.w3.org/2000/svg" 
          className="border rounded-md bg-background shadow-sm w-full max-w-3xl flex-shrink-0"
        >
          {/* Background */}
          <rect x="0" y="0" width="550" height="400" fill="hsl(var(--muted)/0.3)" />

          {/* Paths / Roads - drawn first to be underneath elements */}
          <path d="M90 130 Q150 140 200 120 T280 100 T350 150 T300 250 M200 120 C180 180 200 220 230 250 M350 150 C380 180 380 220 350 250 M 120 290 Q150 280 230 280 M 350 250 Q380 260 400 290 M450 130 L400 180 M280 100 L280 40" stroke="hsl(var(--foreground)/0.15)" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M90 130 Q150 140 200 120 T280 100 T350 150 T300 250 M200 120 C180 180 200 220 230 250 M350 150 C380 180 380 220 350 250 M 120 290 Q150 280 230 280 M 350 250 Q380 260 400 290 M450 130 L400 180 M280 100 L280 40" stroke="hsl(var(--border))" strokeWidth="6" fill="none" strokeLinecap="round"/>

          {/* Tailings Storage Facility (Water Body) */}
          <g id="tailings-storage-area">
            <path d="M400 130 Q480 100 520 150 Q490 220 420 200 Z" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary)/0.4)" strokeWidth="1.5"/>
            <text x="460" y="160" {...labelTextStyle} textAnchor="middle">DEPÓSITO</text>
            <text x="460" y="172" {...labelTextStyle} textAnchor="middle">DE</text>
            <text x="460" y="184" {...labelTextStyle} textAnchor="middle">RELAVES</text>
          </g>

          {/* Open Pit */}
          <g id="open-pit-area">
            <ellipse cx="100" cy="100" rx="70" ry="50" fill="hsl(var(--muted)/0.4)" stroke="hsl(var(--muted-foreground)/0.3)" strokeWidth="1"/>
            <ellipse cx="100" cy="100" rx="55" ry="38" fill="transparent" stroke="hsl(var(--muted-foreground)/0.4)" strokeWidth="1"/>
            <ellipse cx="100" cy="100" rx="40" ry="28" fill="transparent" stroke="hsl(var(--muted-foreground)/0.5)" strokeWidth="1"/>
            <ellipse cx="100" cy="100" rx="25" ry="18" fill="transparent" stroke="hsl(var(--muted-foreground)/0.6)" strokeWidth="1"/>
          </g>
          
          {/* Underground Mine */}
          <g id="underground-mine-area">
            <path d="M60 190 Q80 170 100 190 L90 215 L70 215 Z" fill="hsl(var(--secondary)/0.5)" />
            <rect x="72" y="195" width="16" height="12" fill="hsl(var(--foreground)/0.8)" rx="1"/>
          </g>
          
          {/* Stockpiles */}
          <path d="M180 140 l20 25 l-40 0 z" fill="hsl(var(--secondary-foreground)/0.3)" stroke="hsl(var(--secondary-foreground)/0.5)" strokeWidth="0.5"/>
          <path d="M150 170 l15 20 l-30 0 z" fill="hsl(var(--secondary-foreground)/0.3)" stroke="hsl(var(--secondary-foreground)/0.5)" strokeWidth="0.5"/>

          {/* Ore Processing Plant */}
          <g transform="translate(230 60)" id="ore-processing-plant-area">
            <rect x="0" y="10" width="70" height="50" fill="hsl(var(--secondary)/0.7)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="10" y="0" width="15" height="30" fill="hsl(var(--muted)/0.7)" stroke="hsl(var(--border))" strokeWidth="0.5"/>
            <rect x="30" y="-5" width="15" height="35" fill="hsl(var(--muted)/0.7)" stroke="hsl(var(--border))" strokeWidth="0.5"/>
            <rect x="50" y="5" width="15" height="25" fill="hsl(var(--muted)/0.7)" stroke="hsl(var(--border))" strokeWidth="0.5"/>
            <rect x="65" y="20" width="25" height="30" fill="hsl(var(--secondary)/0.4)" stroke="hsl(var(--border))" strokeWidth="1"/>
            {/* Conveyor */}
            <path d="M-5 40 L-40 55 L-35 65 L0 50 Z" fill="hsl(var(--foreground)/0.2)" stroke="hsl(var(--foreground)/0.4)" strokeWidth="0.5"/>
            <line x1="-5" y1="40" x2="-40" y2="55" stroke="hsl(var(--foreground)/0.4)" strokeWidth="1.5"/>
             <rect x="-45" y="52" width="15" height="15" fill="hsl(var(--secondary)/0.6)" stroke="hsl(var(--border))" strokeWidth="1"/>
          </g>

          {/* Maintenance Workshop */}
          <g transform="translate(50 280)" id="maintenance-workshop-area">
            <rect x="0" y="0" width="60" height="35" fill="hsl(var(--card)/0.8)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="-20" y="5" width="25" height="25" fill="hsl(var(--card)/0.7)" stroke="hsl(var(--border))" strokeWidth="1"/>
          </g>

          {/* Administrative Buildings */}
          <g transform="translate(180 270)" id="admin-buildings-area">
            <rect x="0" y="0" width="35" height="25" fill="hsl(var(--card)/0.8)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="45" y="5" width="35" height="25" fill="hsl(var(--card)/0.8)" stroke="hsl(var(--border))" strokeWidth="1"/>
          </g>

          {/* Control Room */}
          <g id="control-room-area">
             <rect x="330" y="280" width="45" height="30" fill="hsl(var(--card)/0.8)" stroke="hsl(var(--border))" strokeWidth="1"/>
          </g>
          
          {/* Safety & Emergency */}
          <g transform="translate(420 310)" id="safety-emergency-area">
            <rect x="0" y="0" width="50" height="35" fill="hsl(var(--card)/0.8)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <rect x="10" y="-10" width="10" height="10" fill="hsl(var(--destructive)/0.3)"/>
            <rect x="25" y="-10" width="10" height="10" fill="hsl(var(--destructive)/0.3)"/>
          </g>
          
          {/* Smaller buildings / structures */}
          <rect x="280" y="170" width="20" height="15" fill="hsl(var(--muted)/0.6)" stroke="hsl(var(--border))" strokeWidth="0.5"/>
          <rect x="310" y="190" width="25" height="20" fill="hsl(var(--muted)/0.6)" stroke="hsl(var(--border))" strokeWidth="0.5"/>
          <rect x="250" y="220" width="18" height="18" fill="hsl(var(--muted)/0.6)" stroke="hsl(var(--border))" strokeWidth="0.5"/>

          {/* Trees - simple circles with trunks */}
          <g transform="translate(150 240)">
            <circle cx="0" cy="0" r="7" fill="hsl(var(--chart-3)/0.6)"/>
            <rect x="-1.5" y="5" width="3" height="8" fill="hsl(var(--foreground)/0.4)"/>
          </g>
          <g transform="translate(380 230)">
            <circle cx="0" cy="0" r="8" fill="hsl(var(--chart-3)/0.7)"/>
            <rect x="-2" y="6" width="4" height="10" fill="hsl(var(--foreground)/0.5)"/>
            <circle cx="8" cy="-5" r="6" fill="hsl(var(--chart-3)/0.5)"/>
          </g>
           <g transform="translate(500 80)">
            <circle cx="0" cy="0" r="7" fill="hsl(var(--chart-3)/0.6)"/>
            <rect x="-1.5" y="5" width="3" height="8" fill="hsl(var(--foreground)/0.4)"/>
            <circle cx="10" cy="5" r="7" fill="hsl(var(--chart-3)/0.5)"/>
            <rect x="8.5" y="10" width="3" height="8" fill="hsl(var(--foreground)/0.3)"/>
          </g>

          {/* Labels with connecting lines - ensure these are drawn on top */}
          <line x1="100" y1="100" x2="50" y2="50" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="10" y="35" width="90" height="18" {...labelBgStyle} />
          <text x="55" y="48" {...labelTextStyle} textAnchor="middle">RAJO ABIERTO</text>

          <line x1="80" y1="200" x2="40" y2="230" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="5" y="235" width="120" height="18" {...labelBgStyle} />
          <text x="65" y="248" {...labelTextStyle} textAnchor="middle">MINA SUBTERRÁNEA</text>
          
          <line x1="170" y1="150" x2="190" y2="20" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="170" y="5" width="80" height="18" {...labelBgStyle} />
          <text x="210" y="18" {...labelTextStyle} textAnchor="middle">ACOPIOS</text>

          <line x1="260" y1="60" x2="330" y2="30" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="310" y="0" width="130" height="18" {...labelBgStyle} />
          <text x="375" y="13" {...labelTextStyle} textAnchor="middle">PLANTA DE</text>
          <rect x="310" y="17" width="130" height="18" {...labelBgStyle} />
          <text x="375" y="30" {...labelTextStyle} textAnchor="middle">PROCESAMIENTO</text>

          <line x1="60" y1="285" x2="30" y2="340" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="5" y="345" width="130" height="18" {...labelBgStyle} />
          <text x="70" y="358" {...labelTextStyle} textAnchor="middle">TALLER MANTENIMIENTO</text>

          <line x1="200" y1="275" x2="200" y2="330" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="150" y="335" width="100" height="18" {...labelBgStyle} />
          <text x="200" y="348" {...labelTextStyle} textAnchor="middle">ADMINISTRACIÓN</text>

          <line x1="350" y1="285" x2="380" y2="340" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="340" y="345" width="100" height="18" {...labelBgStyle} />
          <text x="390" y="358" {...labelTextStyle} textAnchor="middle">SALA DE CONTROL</text>
          
          <line x1="445" y1="315" x2="445" y2="360" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <rect x="380" y="365" width="130" height="18" {...labelBgStyle} />
          <text x="445" y="378" {...labelTextStyle} textAnchor="middle">SEGURIDAD Y EMERGENCIA</text>
        </svg>

        <div className="mt-4 w-full text-sm text-muted-foreground flex-shrink-0">
          <p className="mb-2 text-center">Este es un esquema ilustrativo. Para mapas interactivos detallados, se integrarían bibliotecas de mapeo y fuentes de datos específicas.</p>
        </div>
      </CardContent>
    </Card>
  );
}
