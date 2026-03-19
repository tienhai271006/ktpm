import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry:1, staleTime:30_000, refetchOnWindowFocus:false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter/>
      <Toaster position="top-right" toastOptions={{
        style: { background:'#fff', color:'#0F1623', border:'1px solid #E4E8F0', fontSize:13, boxShadow:'0 4px 16px rgba(15,22,35,0.12)' },
        success: { iconTheme:{ primary:'#12B76A', secondary:'#fff' } },
        error:   { iconTheme:{ primary:'#EF4444', secondary:'#fff' } },
      }}/>
    </QueryClientProvider>
  );
}
