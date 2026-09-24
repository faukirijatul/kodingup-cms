import { Loader2 } from 'lucide-react';
import { KodingUpLogo } from '@/components/icons/KodingUpLogo';

export function FullPageLoader() {
  return (
    <div className="bg-bg-primary flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="text-blue animate-spin" />
      <KodingUpLogo />
    </div>
  );
}
