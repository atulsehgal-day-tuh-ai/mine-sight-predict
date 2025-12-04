import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';

interface BowtieImageDisplayProps {
  riskName: string | null;
}

export function BowtieImageDisplay({ riskName }: BowtieImageDisplayProps) {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ImageIcon className="h-6 w-6 text-primary" />
          Bowtie Overview Image {riskName ? `for ${riskName}` : ''}
        </CardTitle>
        <CardDescription>
          A visual summary of the risk, controls, causes, and significant events.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Image
          src="https://placehold.co/600x400.png"
          alt={`Bowtie diagram representation for ${riskName || 'selected risk'}`}
          width={600}
          height={400}
          className="rounded-md border object-cover"
          data-ai-hint="bowtie diagram"
        />
        <p className="text-sm text-muted-foreground mt-2">
          This is a placeholder for the Bowtie diagram image.
        </p>
      </CardContent>
    </Card>
  );
}
