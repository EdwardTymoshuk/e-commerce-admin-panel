import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import 'nprogress/nprogress.css'
import '../styles/custom-nprogress.css'
import { SessionProvider } from "next-auth/react"
import { SpinnerProvider } from '../context/SpinnerContext'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  NProgress.done()
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      NProgress.remove()
    })
  }, [])
  return (
    <SessionProvider session={session}>
       <Toaster />
       <SpinnerProvider>
      <Component {...pageProps} />
      </SpinnerProvider>
    </SessionProvider>
  )
}