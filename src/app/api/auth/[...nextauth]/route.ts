import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // فقط GitHub username خودت می‌تونه وارد بشه
      const allowedUsername = process.env.GITHUB_ALLOWED_USERNAME;
      if (!allowedUsername) return false;
      return (profile as { login?: string })?.login === allowedUsername;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/admin/auth",
    error: "/admin/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
