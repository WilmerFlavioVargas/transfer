import { NextAuthOptions, Session, User as NextAuthUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "./dbConnect"
import User, { IUser } from "@/models/User"  // Importamos la interfaz IUser
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose'  // Importamos Types de mongoose

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
      isTwoFactorEnabled?: boolean
      loyaltyPoints?: number;
    }
  }
}

interface ExtendedUser extends NextAuthUser {
  role?: string | null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await dbConnect()

          const user = await User.findOne({ email: credentials.email }).exec()

          if (!user) {
            return null
          }

          const isPasswordValid = await user.comparePassword(credentials.password)

          if (!isPasswordValid) {
            return null
          }

          // Aseguramos que user._id es tratado como ObjectId
          const userId = user._id instanceof Types.ObjectId 
            ? user._id.toString() 
            : (user._id as Types.ObjectId).toString()
          return {
            id: userId,
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            role: user.role,
          }
        } catch (error) {
          console.error('Error en autorización:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as ExtendedUser).role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
}
