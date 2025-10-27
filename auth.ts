import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    session({session, token}) {
      console.log('session:', session, token)
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  debug: true
});
