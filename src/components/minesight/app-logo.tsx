
import type { SVGProps } from 'react';

const DaytuhAiGuardianLogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 340 55" // Adjusted viewBox for longer name "Guardián"
    xmlns="http://www.w3.org/2000/svg"
    // Removed fill and stroke from here as paths will handle it or inherit via currentColor
    {...props}
  >
    <title>Day-tuh.ai Guardián Logo</title>
    {/* New Icon: Angled brackets < > */}
    <g className="text-primary" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 12.5 L15 27.5 L35 42.5" /> 
      <path d="M45 12.5 L65 27.5 L45 42.5" />
    </g>

    {/* Text: Day-tuh.ai Guardián */}
    <text
      x="90" 
      y="35"
      fontFamily="Inter, Arial, sans-serif"
      fontSize="22" 
      fontWeight="bold"
      className="fill-foreground"
    >
      Day-tuh.ai Guardián
    </text>

    {/* Tagline: Predictive Safety Analytics */}
    <text
      x="90" 
      y="50"
      fontFamily="Inter, Arial, sans-serif"
      fontSize="10"
      fontWeight="500"
      className="fill-muted-foreground"
    >
      Predictive Safety Analytics
    </text>
  </svg>
);

export function AppLogo() {
  return (
    <div className="flex items-center px-2 py-3">
      <DaytuhAiGuardianLogoIcon className="h-10 w-auto" />
    </div>
  );
}
