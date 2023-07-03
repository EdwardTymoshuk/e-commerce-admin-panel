import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"
import { BiMenu } from "react-icons/bi"
import { IoMdClose } from "react-icons/io"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="bg-blue-900 w-scren h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg text-black">Login with google</button>
        </div>
      </div>
    )
  }
  return (
    <div className={(!showNav ? "bg-page-color" : "bg-primary-color flex flex-col") + " min-h-screen"}>
      <div className="flex flex-row items-center p-4 self-end md:hidden bg-primary-color">
      <button onClick={() => setShowNav(!showNav)} className="md:hidden text-secondary-color m-0 ease-in self-center">{showNav ? <IoMdClose size={36} /> : <BiMenu size={36}/>}</button>
      {
        !showNav ?
        <div className="flex grow justify-center mr-9">
      <Logo size={36}/>
      </div> :
      ''
      }
      </div>
      <div className="flex">
        <Nav show={showNav}/>
        <div className="p-4 bg-page-color text-black w-full">{children}</div>
      </div>
    </div>
  )


}
