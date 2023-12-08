import { useSession } from "next-auth/react"
import Layout from "../components/Layout"

/**
 * Home component responsible for rendering the home page.
 *
 * @returns {JSX.Element} - Rendered Home component.
 */
const Home = () => {
  const { data: session } = useSession()

  // If the user is not logged in, display a message with a link to the login page
  if (!session) {
    return (
      <h1>
        It looks like you aren't logged in. Please visit the{" "}
        <a className="text-secondary-color" href="/api/auth/signin">
          login page
        </a>
        .
      </h1>
    )
  }

  // If the user is logged in, display a welcome message and user profile information
  return (
    <Layout>
      <div className="flex text-md p-4 text-primary-color gap-2 items-center justify-end">
        <h2>Hello, {session?.user.name.split(" ")[0]}!</h2>
        <div className="flex w-12">
          <img
            className="rounded-full"
            src={session?.user.image}
            alt="profile image"
          />
        </div>
      </div>
    </Layout>
  )
}
export default Home