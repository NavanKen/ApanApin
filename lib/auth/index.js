import NextAuth from "next-auth";
import environment from "@/config/environment";
import Credentials from "next-auth/providers/credentials";
import AuthController from "@/controllers/auth.controller";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: environment.AUTH_SECRET,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "identifier", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials;

        const result = await AuthController.LoginController({
          identifier,
          password,
        });

        if (result.status) {
          const user = result.data.user;

          return {
            id: user.id_user,
            username: user.username,
            role: user.role,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
});
