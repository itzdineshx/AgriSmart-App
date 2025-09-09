import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Temporary mock version - language functionality disabled
export function LanguageToggle() {
  return (
    <Button variant="ghost" size="icon" className="relative" disabled>
      <Languages className="h-4 w-4" />
      <span className="sr-only">Language toggle (disabled)</span>
    </Button>
  );
}