import axios from 'axios';

export enum ApiResponseStatus {
  ERROR = 'error',
  SUCCESS = 'success'
}

export type ApiResponse<T> = {
  status: ApiResponseStatus;
  message: string;
  data?: T;
}

enum ApiAction {
  GET_SUPPORTER_LEVEL = 'v1/discord/getSupporterLevel.php',
}

const baseUrl = 'https://api.geotastic.de';

export class GeotasticApi {
  public static async getSupporterLevel(discordTag: string): Promise<ApiResponse<number>> {
    const url = `${baseUrl}/${ApiAction.GET_SUPPORTER_LEVEL}?tag=${encodeURIComponent(discordTag)}`;
    const response = await axios.get<ApiResponse<number>>(url);
    return response.data;
  }
}