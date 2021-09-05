import Twitter from "twitter";

export class TwitterClient {
  private client: Twitter;
  private optional: Record<string, any>;

  constructor(
    accessToken: string,
    refreshToken: string,
    optional: Record<string, any>
  ) {
    this.client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: accessToken,
      access_token_secret: refreshToken,
    });
    this.optional = optional;
  }

  async startBlock(cursor: number) {
    console.log("startCursor:" + cursor);
    const followerRequest = await this.getFollowerList(cursor);
    if (followerRequest.users.length === 0) {
      return {
        nextCursor: 0,
        blockedUser: [],
      };
    }

    let nextCursor = followerRequest.next_cursor;
    let blockedUser = [];
    for (let user of followerRequest.users) {
      if (!user.following) {
        if (
          user.protected ||
          user.default_profile_image ||
          // user.followers_count * 80 < user.friends_count ||
          user.statuses_count == 0
        ) {
          console.log(
            "userID: " + user.id + ", screen_name:" + user.screen_name
          );
          blockedUser.push({ userID: user.id, screenName: user.screen_name });
          await this.blockUser(user.screen_name);
        }
      }
    }
    return {
      nextCursor,
      blockedUser,
    };
  }

  private async getFollowerList(cursor: number) {
    const res = await this.client.get(
      "https://api.twitter.com/1.1/followers/list.json",
      {
        cursor,
      }
    );
    return res;
  }

  private async blockUser(screenName: string) {
    const res = await this.client.post(
      "https://api.twitter.com/1.1/blocks/create.json",
      {
        screen_name: screenName,
      }
    );
    return res;
  }
}
