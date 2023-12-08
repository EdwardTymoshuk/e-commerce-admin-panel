import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'
import ButtonWithSpinner from './ButtonWithSpinner'
import { useState } from 'react'

/**
 * GoBackButton Component
 * @returns {JSX.Element} - Rendered component
 */
const GoBackButton = () => {
  const [isGoBack, setIsGoBack] = useState(false)
  const router = useRouter()

  /**
   * Handles the go back action
   */
  const handleGoBack = () => {
    setIsGoBack(true)
    try {
      router.back()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ButtonWithSpinner
      className="btn-no-bg btn-dark-text"
      onClick={handleGoBack}
      icon={<IoIosArrowBack size={18} />}
      size={24}
      isLoading={isGoBack}
      text=""
      color="#e9c46a"
    />
  )
}

export default GoBackButton // Export the component
