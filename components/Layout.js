import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"

export default function Layout({children}) {
  const {data: session} = useSession()
  if(!session) {
    return (
      <div className="bg-blue-900 w-scren h-screen flex items-center">
        <div className="text-center w-full">
        <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg text-black">Login with google</button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex bg-blue-900 min-h-screen">
          <Nav />
          <div className="p-8 bg-white text-black w-full">{children}</div>
    </div>
  )


}
