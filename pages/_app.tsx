// Custom hooks
import { DataProvider } from '@/hooks/data'

// Styling related import
import '@/styles/globals.css'

// Type import
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}
