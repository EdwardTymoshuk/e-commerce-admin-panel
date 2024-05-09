import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Dashboard from "../components/Dashboard"
import Layout from "../components/Layout"

/**
 * Home component responsible for rendering the home page.
 *
 * @returns {JSX.Element} - Rendered Home component.
 */
const Home = () => {
  const { data: session, status } = useSession()

  const router = useRouter()
  // If we're on the server side or session is still loading, return null
  if (typeof window === "undefined" || status === "loading") {
    return null
  }

  // If the user is not logged in, display a message with a link to the login page
  if (!session) {
    // Перевірка, чи вже не на сторінці логіну перед перенаправленням
    if (router.pathname !== "/login") {
      router.push("/login")
    }
    return null
  }

  // If the user is logged in, display a welcome message and user profile information
  return (
    <Layout>
      <div className="flex text-md p-4 text-primary-color gap-2 items-center justify-end">
        <h2>Hi, {session?.user?.name?.split(" ")[0] || 'there'}!</h2>
        <div className="flex w-12">
          <img
            className="rounded-full"
            src={session?.user?.image || "/avatar-astronaut.jpeg"}
            alt="profile image"
          />
        </div>
      </div>
      <Dashboard />
    </Layout>
  )
}

export default Home
