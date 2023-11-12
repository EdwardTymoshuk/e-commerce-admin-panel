import React, { createContext, useContext, useState, useCallback } from 'react'

const SpinnerContext = createContext()

export const SpinnerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const showSpinner = () => {
    setIsLoading(true)
  }

  const hideSpinner = () => {
    setIsLoading(false)
  }

  const value = {
    isLoading,
    showSpinner,
    hideSpinner,
  }

  return (
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  )
}

export const useSpinner = () => {
  const context = useContext(SpinnerContext)
  if (!context) {
    throw new Error('useSpinner must be used within a SpinnerProvider')
  }
  return context
}