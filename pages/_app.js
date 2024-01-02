// Importing necessary libraries, styles, and context providers
import { Toaster } from 'react-hot-toast' // Notification toaster library
import '../styles/globals.css' // Global styles
import 'nprogress/nprogress.css' // Loading progress bar styles
import '../styles/custom-nprogress.css' // Customized loading progress bar styles
import { SessionProvider } from "next-auth/react" // NextAuth session provider
import { SpinnerProvider } from '../context/SpinnerContext' // Custom context provider for managing spinners
import { Router } from 'next/router' // Next.js router library
import NProgress from 'nprogress' // Loading progress bar library
import { useEffect } from 'react' // React's useEffect hook

// Event listeners for the loading progress bar during route changes
Router.events.on('routeChangeStart', () => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  NProgress.done()
})

/**
 * Main App component responsible for rendering the entire application.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.Component - Main component to be rendered.
 * @param {Object} props.pageProps - Page props, including session and additional data.
 * @returns {JSX.Element} - Rendered App component.
 */
const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  // Cleanup event listener to remove the loading progress bar
  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      NProgress.remove()
    })
  }, [])

  // Rendering the components with session and spinner providers
  return (
    <SessionProvider session={session}>
      {/* Notification toaster for displaying messages */}
      <Toaster />
      {/* Custom context provider for managing spinners */}
      <SpinnerProvider>
        {/* Render the main component */}
        <Component {...pageProps} />
      </SpinnerProvider>
    </SessionProvider>
  )
}

export default App