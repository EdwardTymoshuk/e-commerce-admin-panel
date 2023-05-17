import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
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
    <div>Hello, {session.user.name} </div>
  )


}
