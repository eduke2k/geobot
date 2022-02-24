import axios, { AxiosRequestConfig } from 'axios';

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

export const backendBaseUrl = 'https://backend01.geotastic.de';
export const backendToken = '98b3d45a65864197b670fbab01e97b5b';

export class GeotasticApi {
  public static withAuthHeader (token: string): AxiosRequestConfig {
    return {
      headers: {
        'X-Auth-Token': token
      }
    };
  };

  public static async getSupporterLevel(discordTag: string): Promise<ApiResponse<number>> {
    const url = `${backendBaseUrl}/${ApiAction.GET_SUPPORTER_LEVEL}?tag=${encodeURIComponent(discordTag)}`;
    const response = await axios.get<ApiResponse<number>>(url);
    return response.data;
  }
}