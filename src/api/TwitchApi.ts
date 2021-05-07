import axios from 'axios';
import * as dotenv from 'dotenv';
const BASE_URL = 'https://api.twitch.tv/kraken/';

export type TwitchStreamsResponseJSON = {
  streams: TwitchStreamResponseJSON[];
}

export type TwitchStreamResponseJSON = {
  _id: number;
  average_fps: number;
  channel: {
    _id: number;
    broadcaster_language: string;
    created_at: string;
    display_name: string;
    followers: number;
    game: string;
    language: string;
    logo: string;
    mature: boolean;
    name: string;
    partner: boolean;
    profile_banner: string;
    profile_banner_background_color: string | null;
    status: string;
    updated_at: string;
    url: string;
    video_banner: string;
    views: number;
  };
  created_at: string;
  delay: number;
  game: string;
  is_playlist: boolean;
  preview: {
    large: string;
    medium: string;
    small: string;
    template: string;
  };
  video_height: number;
  viewers: number;
}

export class TwitchApi {
  public static async getActiveStreams (): Promise<TwitchStreamsResponseJSON> {
    return (await axios.get<TwitchStreamsResponseJSON>(`${BASE_URL}streams?game=geotastic`,
      {
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-Id': dotenv.config().parsed.TWITCH_CLIENT_ID
        }
      }
    )).data;
  }
}
