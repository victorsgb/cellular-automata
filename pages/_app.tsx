// Type imports
import { AppProps } from 'next/app';

// Styling related imports
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}/>
}

export default App;