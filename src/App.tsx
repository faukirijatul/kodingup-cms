import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './routes/router';

export function App() {
  return (
    <QueryProvider>
      <AppRouter />
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </QueryProvider>
  );
}
