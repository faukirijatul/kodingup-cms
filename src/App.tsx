import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';

export function App() {
  return (
    <QueryProvider>
      <div>Test</div>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </QueryProvider>
  );
}
