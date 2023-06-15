import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home() {
  const {data: session} = useSession()

    if (!session) {
      return <h1>It looks like you aren`t loged in. Please visit the <a className="text-secondary-color" href="/api/auth/signin">login page</a>.</h1>
    }

    return (
      <Layout>
        <div className="flex text-md p-4 text-logo-color gap-2 items-center justify-end">
          <h2>Hello, {session?.user.name.split(' ')[0]}!</h2>
          <div className="flex w-12">
          <img className="rounded-full" src={session?.user.image} alt="profile image"/>
          </div>    
        </div>
      </Layout>
    )
}
