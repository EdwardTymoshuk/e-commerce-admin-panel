import NextAuth, { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const adminEmails = ['eduard.tymoshuk@gmail.com', 'edward.tymoshuk.dev@gmail.com']

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session
      } else {
        return false
      }
    },
  },
}

export const isAdminRequest = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!adminEmails.includes(session?.user?.email)) {
      res.status(401).end()
      throw new Error('It looks like you`re not an admin. Please login to your admin account.')
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    res.status(500).end()
  }
}

export default NextAuth(authOptions)