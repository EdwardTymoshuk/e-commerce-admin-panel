import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { useState } from "react";
import { useSpinner } from "../context/SpinnerContext";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { showSpinner } = useSpinner()

  const router = useRouter()
  const { data: session, status } = useSession()

  const handleAddUser = async () => {
    try {
      await axios.post("/api/addUser").then(res => res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!result.error) {
      router.push("/")
    } else {
      // Обробка помилок аутентифікації
      console.error("Authentication failed:", result.error);
    }
  }

  if (status === 'loading') return showSpinner()

  if (status === 'authenticated') { router.push('/') } else {
    return (
      <div className="flex flex-row min-h-screen bg-cover">
        <div className="flex flex-col gap-2 items-center justify-center text-center w-full md:w-1/2 p-8 md:p-2 bg-primary-color">
          <h1 className="text-4xl text-secondary-color">Hi, nice to see you!</h1>
          <h2 className="text-xl">Please login to your GOOGLE acount.</h2>
          <button className="mt-10" onClick={() => signIn('google')}><FcGoogle />Log in</button>
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

      // <div className="flex flex-col gap-4 h-screen w-full justify-center items-center bg-dark-text-color">
      //   <div className="flex flex-col items-center">
      //     <h1 className="text-4xl text-secondary-color">Hi, nice to see you!</h1>
      //     <h2 className="text-xl">Login to your account.</h2>
      //   </div>
      //   <div className="flex w-1/2">
      //     <form onSubmit={handleLogin} className="w-full flex flex-col ">
      //       <label className="block">
      //         Username:
      //         <input required
      //           type="text"
      //           name="username"
      //           value={username}
      //           placeholder="Enter your email adress"
      //           onChange={(e) => setUsername(e.target.value)} />
      //       </label>
      //       <br />
      //       <label className="block">
      //         Password:
      //         <input required
      //         type="password" 
      //         name="password"
      //         value={password}
      //         placeholder="Enter your password"
      //         onChange={(e) => setPassword(e.target.value)}  />
      //       </label>
      //       <br />
      //       <button type="submit">Log In</button>
      //     </form>
      //   </div>

      //   <button onClick={() => handleAddUser()}>Add user</button>
      // </div>
    )
  }
}

export default Login
