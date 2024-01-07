import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { useState } from "react";
import { useSpinner } from "../context/SpinnerContext";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { showSpinner } = useSpinner()

  const router = useRouter()
  const { data: session, status } = useSession()

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (!result.error) {
      router.push("/")
      return
    } else {
      // Обробка помилок аутентифікації
      console.error("Authentication failed:", result.error);
    }
  }

  if (status === 'loading') return showSpinner()

  if (status === 'authenticated') { router.push('/') } else {
    return (
      <div className="flex flex-row min-h-screen bg-cover">
        <div className="flex flex-col gap-2 items-center justify-center text-center w-full md:w-1/2 p-6 xs:p-20 md:p-6 bg-primary-color">
          <h1 className="text-4xl text-secondary-color">Hi, nice to see you!</h1>
          <h2 className="text-xl">Please log in to your GOOGLE acount.</h2>
          <button className="my-8 w-full justify-center" onClick={() => signIn('google')}><FcGoogle />Log in</button>
          <p className="text-light-text-color">- Or with email and password -</p>
          <form onSubmit={handleLogin} className="w-full flex flex-col">
            <label className="block text-left font-semibold">
              Email:
              </label>
              <input required
                type="text"
                className="rounded-md"
                name="email"
                value={email}
                placeholder="Enter your email adress"
                onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label className="block text-left font-semibold">
              Password:
              </label>
              <input required
              type="password" 
              className="rounded-md"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}  />
            <br />
            <button type="submit" className="w-full justify-center">Log In</button>
          </form>
          <p className="text-light-text-color py-2">Tip: for aapplication testing enter "test@test.com" as email and "Testpassword123!" as password.</p>
        </div>
        <div className="w-0 md:w-full flex relative">
          <div className="aspect-w-16 aspect-h-9">
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
