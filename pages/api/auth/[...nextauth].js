import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const adminEmails = ["eduard.tymoshuk@gmail.com", "centellacareshop@gmail.com", "test@test.com"]

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user}) => {
     return session
    },
  },
}

export default NextAuth(authOptions)


export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}