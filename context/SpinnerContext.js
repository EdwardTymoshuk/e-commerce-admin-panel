import { createContext, useContext, useState, useCallback } from 'react'

// Creating a context to share loading state data
const SpinnerContext = createContext()

// Data provider component for SpinnerProvider
export const SpinnerProvider = ({ children }) => {
  // State indicating whether the spinner is visible
  const [isLoading, setIsLoading] = useState(false)

  // Function to show the spinner
  const showSpinner = useCallback(() => {
    setIsLoading(true)
  }, [])

  // Function to hide the spinner
  const hideSpinner = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Value that will be available in the context
  const value = {
    isLoading,
    showSpinner,
    hideSpinner,
  }

  return (
    // Providing the value through context to all descendants
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  )
}

// Custom hook for convenient use of the SpinnerContext
export const useSpinner = () => {
  const context = useContext(SpinnerContext)
  if (!context) {
    // Throw an error if the hook is used outside of SpinnerProvider
    throw new Error('useSpinner must be used within a SpinnerProvider')
  }
  return context
}
