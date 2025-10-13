import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <Info className="w-4 h-4" />
            Default tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get detailed information about this feature.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
