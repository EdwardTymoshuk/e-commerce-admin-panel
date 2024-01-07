import NextAuth, { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "../../../models/User"
import bcrypt from "bcrypt"
import clientPromise from "../../../lib/mongodb"

// List of admin emails for authorization
const adminEmails = ["eduard.tymoshuk@gmail.com", "centellacareshop@gmail.com", "test@test.com"]

// Configuration options for NextAuth
export const authOptions = {
  providers: [
    // Google OAuth provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    // Custom credentials provider for email/password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic to verify credentials here
        if (!credentials) return null

        const { email, password } = credentials
        
        // Fetch user from your database based on the provided email
        const user = await User.findOne({ email })
        
        // Check if the provided password matches the stored hashed password
        if (user && bcrypt.compareSync(password, user.password)) {
          // Return the user object if credentials are valid
          return user
        } else {
          // Return null if credentials are invalid
          throw new Error("Invalid credentials")
        }
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt", // Use JWT for session management
  },

  // Secret used to encrypt the session data
  secret: process.env.NEXT_AUTH_SECRET,

  // MongoDB adapter for storing NextAuth data
  adapter: MongoDBAdapter(clientPromise),

  // Callbacks for handling session data
  callbacks: {
    session: ({ session, token, user }) => {
      // Return the session data
      return session
    },
  },
}

// Export the configured NextAuth instance
export default NextAuth(authOptions)

// Middleware for checking if the user is an admin
export async function isAdminRequest(req, res) {
  // Check if the user"s email is in the list of admin emails
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw "not an admin"
  }
}
