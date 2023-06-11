import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
       <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  )
}