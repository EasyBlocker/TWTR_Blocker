import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { TwitterClient } from "./twitterClient";

type Data = {
  nextCursor: number;
  blockedUser: { userID: string; screenName: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session: any = await getSession({ req });
  const cursor = req.body.cursor;
  const twitterClient = new TwitterClient(
    session.accessToken,
    session.refreshToken,
    {}
  );

  const result = await twitterClient.startBlock(cursor);

  res.status(200).json(result);
}
