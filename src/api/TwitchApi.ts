import axios from 'axios';
import { ApiResponse, backendBaseUrl, backendToken, GeotasticApi } from './GeotasticApi';

enum ServerApiAction {
  GET_ACTIVE_STREAMS = 'v1/twitch/getGeoStreams.php',
  GET_USER_BY_CHANNEL = 'v1/twitch/getUserByChannel.php',
  GET_STREAM_BY_CHANNEL = 'v1/twitch/getStreamByChannel.php'
}

export type TwitchUserResponseJSON = {
  broadcaster_type: string;
  created_at: string;
  description: string;
  display_name: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: number;
}

export type TwitchStreamResponseJSON = {
  game_id: string;
  game_name: string;
  id: string;
  is_mature: boolean;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
  user?: TwitchUserResponseJSON;
}

export type StreamByChannelResponse = {
  stream: TwitchStreamResponseJSON | null;
}

export type UserByChannelResponse = {
  user: TwitchUserResponseJSON | null;
}

export class TwitchApi {
  public static mapLanguageToCountry (language: string): string {
    if (language === 'other') return 'earth';
    const split = language.split('-');
    const toCheck = split[1] ?? split[0];

    switch (toCheck) {
      case 'ja': return 'jp';
      case 'sv': return 'se';
      case 'cs': return 'cz';
      case 'cn': return 'cn';
      case 'kg': return 'hk';
      case 'hk': return 'hk';
      case 'mo': return 'mo';
      case 'sg': return 'sg';
      case 'tw': return 'tw';
      default: return toCheck;
    }
  }

  public static getChannelUrl (stream: TwitchStreamResponseJSON): string {
    return `https://twitch.tv/${stream.user_name}`;
  }

  public static getStreamThumbnail (stream: TwitchStreamResponseJSON, sizeMultiplier: number): string {
    return stream.thumbnail_url
      .replace('{width}', (1920 * sizeMultiplier).toString())
      .replace('{height}', (1080 * sizeMultiplier).toString());
  }

  public static async getStreamByChannel (channel: string): Promise<ApiResponse<StreamByChannelResponse>> {
    return (await axios.get(`${backendBaseUrl}/${ServerApiAction.GET_STREAM_BY_CHANNEL}?channel=${channel}`)).data;
  }

  public static async getUserByChannelName (channelName: string): Promise<ApiResponse<UserByChannelResponse>> {
    return (await axios.get(`${backendBaseUrl}/${ServerApiAction.GET_USER_BY_CHANNEL}?channel=${channelName}`)).data;
  }

  public static async getActiveStreams (): Promise<ApiResponse<TwitchStreamResponseJSON[]>> {
    return (await axios.get(`${backendBaseUrl}/${ServerApiAction.GET_ACTIVE_STREAMS}`, GeotasticApi.withAuthHeader(backendToken))).data;
  }
}
