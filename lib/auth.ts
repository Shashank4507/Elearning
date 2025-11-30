import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getStudentsCollection } from "./collections"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password")
        }

        const students = await getStudentsCollection()
        const student = await students.findOne({ email: credentials.email })

        if (!student) {
          throw new Error("No user found with this email")
        }

        if (!student.password) {
          throw new Error("Please set up your password")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, student.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: student._id.toString(),
          email: student.email,
          name: student.name,
          image: student.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
