import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowedUsername = process.env.GITHUB_ALLOWED_USERNAME;
      if (!allowedUsername) return false;
      return (profile as { login?: string })?.login === allowedUsername;
    },
  },
  pages: {
    signIn: "/admin/auth",
    error: "/admin/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
