import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BarChart } from 'lucide-react';

export default function PredictPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Content Prediction</h1>
      <p className="text-lg text-foreground/80">
        (Coming Soon) Get AI-driven predictions on your content's potential reach and engagement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prediction Input Form (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Predict Content Performance</CardTitle>
            <CardDescription>Enter details about your planned content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="content-title">Content Title</Label>
              <Input id="content-title" placeholder="Enter your catchy title" disabled />
            </div>
             <div className="space-y-2">
              <Label htmlFor="content-description">Brief Description/Script Outline</Label>
              <Textarea id="content-description" placeholder="Paste a brief description or outline..." rows={5} disabled />
            </div>
             <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Input id="target-audience" placeholder="e.g., 'Tech enthusiasts', 'Beginner photographers'" disabled />
            </div>
             <div className="space-y-2">
               <Label htmlFor="platform">Platform</Label>
               {/* Replace with Select component when functional */}
               <Input id="platform" placeholder="e.g., 'YouTube', 'Blog', 'Instagram'" disabled />
             </div>
            <Button disabled>Predict Performance (Coming Soon)</Button>
          </CardContent>
        </Card>

        {/* Prediction Results Display (Placeholder) */}
        <Card className="flex flex-col items-center justify-center bg-muted/50 border-dashed border-border">
          <CardHeader className="text-center">
             <BarChart className="h-12 w-12 mx-auto text-foreground/40 mb-4" />
            <CardTitle className="text-foreground/70">Prediction Results</CardTitle>
            <CardDescription className="text-foreground/50">Analysis will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-foreground/60">
            <p>Enter content details to see potential reach, engagement scores, and suggestions.</p>
            <p className="text-sm mt-2">(Feature under development)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
