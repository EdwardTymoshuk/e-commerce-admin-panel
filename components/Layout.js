import { useSession, signIn } from 'next-auth/react'
import Nav from './Nav'
import { BiMenu } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import { useState } from 'react'
import Logo from './Logo'

/**
 * Layout Component
 * @param {React.ReactNode} children - The content to be rendered inside the layout
 * @returns {JSX.Element} - Rendered component
 */
const Layout = ({ children }) => {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()

  // Render login screen if there's no active session
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg text-black">Login with google</button>
        </div>
      </div>
    )
  }

  return (
    <div className={(!showNav ? 'bg-page-color' : 'bg-primary-color flex flex-col') + ' min-h-screen'}>
      <header className={`${!showNav && 'fixed w-full'} flex flex-row items-center p-4 self-end md:hidden bg-primary-color text-sm md:text-base z-50`}>
        <button onClick={() => setShowNav(!showNav)} className="btn-no-bg md:hidden m-0 ease-in self-center">{showNav ? <IoMdClose size={36} /> : <BiMenu size={36}/>}</button>
        {!showNav ?
          <div className="flex grow justify-center mr-9">
            <Logo size={36}/>
          </div> :
          ""
        }
      </header>
      <div className={`flex ${!showNav && 'pt-[76px] md:pt-0'}`}>
        <Nav show={showNav}/>
        <div className={`${showNav && 'hidden'} p-4 bg-page-color w-full text-black`}>{children}</div>
      </div>
    </div>
  )
}
export default Layout
