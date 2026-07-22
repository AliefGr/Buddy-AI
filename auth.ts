import NextAuth, { Account, Profile, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { store: true },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          storeId: user.store?.id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account?: Account | null;
      profile?: Profile;
    }) {
      if (!account) {
        // If no account, just continue sign in
        return true;
      }

      if (account.provider === "google" && user.email && user.name) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { store: true },
        });

        if (existingUser) {
          // Check if Google account is linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            // Link Google account to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            });
          }

          // Update user object with storeId
          user.id = existingUser.id;
          (user as any).storeId = existingUser.store?.id ?? null;
          return true;
        }

        // Create new user with Google
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            avatarUrl: (profile as any)?.picture,
            store: {
              create: {
                name: `Toko ${user.name}`,
              },
            },
            notificationSettings: {
              create: {},
            },
            accounts: {
              create: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
          },
          include: { store: true },
        });

        user.id = newUser.id;
        (user as any).storeId = newUser.store?.id ?? null;
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.storeId = (user as { storeId?: string | null }).storeId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { storeId?: string | null }).storeId =
          token.storeId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
