import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await NextAuth(req, res, {
    providers: [
      Providers.Twitter({
        clientId: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
      }),
    ],

    jwt: {
      secret: process.env.JWT_SIGNING_PRIVATE_KEY,
    },

    callbacks: {
      async session(session, token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        return session;
      },

      async jwt(token, user, account, profile, isNewUser) {
        if (account?.accessToken && account.refreshToken) {
          token.accessToken = account.accessToken;
          token.refreshToken = account.refreshToken;
        }
        return token;
      },
    },
  });
}
