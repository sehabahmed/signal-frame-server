import config from "../../../config";
import { INewsSource } from "../newsfeed.interface";

export class TwitterSource implements INewsSource {
  private readonly bearerToken = config.twitter_bearer_token;
  private readonly baseUrl = "https://api.twitter.com/2";
  private readonly usernames = ["doganuraldesign"];

  getName() {
    return 'twitter' as const;
  }
}
