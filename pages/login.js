import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSpinner } from "../context/SpinnerContext"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"
import { CircleSpinner } from "../components/Spinner"

/**
 * Login component responsible for rendering the login page.
 *
 * @returns {JSX.Element} - Rendered Login component.
 */
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogining, setIsLogining] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  })
  const [authError, setAuthError] = useState(false)

  // Use the showSpinner function from SpinnerContext
  const { showSpinner } = useSpinner()

  const router = useRouter()
  const { data: session, status } = useSession()

  /**
   * Handle the login form submission.
   *
   * @param {Event} e - The form submission event.
   */

  // Validate the email input field.
  const validateEmail = () => {
    let isValid = true
    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!email) {
      setEmailError('Email is required')
      setInputError((prevState) => ({ ...prevState, email: true }))
      isValid = false
    } else if (!email.match(validEmail)) {
      setEmailError('Invalid e-mail format')
      setInputError((prevState) => ({ ...prevState, email: true }))
      isValid = false
    } else if (email.length < 5) {
      setEmailError('Email must be at least 3 characters')
      setInputError((prevState) => ({ ...prevState, email: true }))
      isValid = false
    } else if (email.length > 75) {
      setEmailError('Email must be less than 75 characters')
      setInputError((prevState) => ({ ...prevState, email: true }))
      isValid = false
    } else {
      setEmailError('')
      setInputError((prevState) => ({ ...prevState, email: false }))
    }
    return isValid
  }

  // Validate the password input field.
  const validatePassword = () => {
    let isValid = true
    if (!password) {
      setPasswordError('Password is required')
      setInputError((prevState) => ({ ...prevState, password: true }))
      isValid = false
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 3 characters')
      setInputError((prevState) => ({ ...prevState, password: true }))
      isValid = false
    } else if (password.length > 75) {
      setPasswordError('Password must be less than 75 characters')
      setInputError((prevState) => ({ ...prevState, password: true }))
      isValid = false
    } else {
      setPasswordError('')
      setInputError((prevState) => ({ ...prevState, password: false }))
    }
    return isValid
  }

  // Validate the entire form.
  const validateForm = () => {
    const isValid =
      validateEmail() &&
      validatePassword()

    return isValid
  }

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLogining(true)
    let isValid = validateForm()
    if (isValid) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (!result.error) {
        // Redirect to the home page on successful login
        router.push("/")
        return
      } else {
        console.error("Authentication failed:", result.error)
        setAuthError(true)
      }
    }
    setIsLogining(false)
  }

  // Show spinner during the loading state
  if (status === "loading") return showSpinner()

  // If already authenticated, redirect to the home page
  if (status === "authenticated") {
    router.push("/")
  } else {
    // Render the login page
    return (
      <div className="flex flex-row min-h-screen bg-cover">
        <div className="flex flex-col gap-2 items-center justify-center text-center w-full md:w-1/2 p-6 xs:p-20 md:p-6 bg-primary-color">
          <h1 className="text-4xl text-secondary-color">Hi, nice to see you!</h1>
          <h2 className="text-xl">Please log in to your GOOGLE account.</h2>
          <button
            className="my-8 w-full justify-center"
            onClick={() => signIn("google")}
          >
            <FcGoogle /> Log in
          </button>
          <p className="text-light-text-color">- Or with email and password -</p>
          <form onSubmit={handleLogin} className="w-full flex flex-col">
            {authError &&
              <p className="bg-danger-lighter-color border-l-8 border-danger-color p-2 rounded-md text-sm">Incorrect email address or password. Please check it and try again.</p>
            }
            <label className="block text-left font-semibold">
              Email:
            </label>
            <input

              type="text"
              className={`rounded-md ${inputError.email && "border-[1px] border-danger-color"}`}
              name="email"
              value={email}
              placeholder="Enter your email address"
              inputError={inputError.emailError}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError ? <span className="text-danger-color text-sm pt-2">{emailError}</span> : <br />}
            <label className="block text-left font-semibold">
              Password:
            </label>
            <input

              type="password"
              className={`rounded-md ${inputError.password && "border-[1px] border-danger-color"}`}
              name="password"
              value={password}
              placeholder="Enter your password"
              inputError={inputError.passwordError}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <span className="text-danger-color text-sm pt-2">{passwordError}</span>}
            <br />
            <button type="submit" className="w-full justify-center">
              {isLogining ? <CircleSpinner size={24} color="var(--color-text)" /> : "Log In"}
            </button>
          </form>
          <p className="text-light-text-color py-2">
            Tip: for application testing, please use 'test@test.com' as the email and 'Testpassword123!' as the password.
          </p>
        </div>
        <div className="w-0 md:w-full flex relative">
          <div className="aspect-w-16 aspect-h-9">
            {/* Image component for the login page cover */}
            <Image
              className="object-cover"
              src="/login-page-cover.jpeg"
              fill
              alt="login page image"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Login
