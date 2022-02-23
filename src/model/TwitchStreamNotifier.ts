import { MessageEmbedOptions } from 'discord.js';
import { ApiResponseStatus } from '../api/GeotasticApi';
import { TwitchApi, TwitchStreamResponseJSON } from '../api/TwitchApi';

// Defaults to 5min
const defaultInterval = 0.5 * 60 * 1000;

export function getTwitchChatMessage (stream: TwitchStreamResponseJSON): string {
  return `**${stream.user_name}** is streaming geotastic! Say hello: ${TwitchApi.getChannelUrl(stream)}`;
}

export function getTwitchEmbedOptions (stream: TwitchStreamResponseJSON): MessageEmbedOptions {
  return {
    color: 0x0099ff,
    title: stream.title,
    url: TwitchApi.getChannelUrl(stream),
    author: {
      name: stream.user_name,
      iconURL: stream.user?.profile_image_url,
      url: TwitchApi.getChannelUrl(stream),
    },
    thumbnail: {
      url: stream.user?.profile_image_url,
    },
    fields: [
      {
        name: 'Game',
        value:  stream.game_name,
        inline: true
      },
      {
        name: 'Viewers',
        value: stream.viewer_count,
        inline: true
      }
    ],
    image: {
      url:  TwitchApi.getStreamThumbnail(stream, 0.25),
    }
  };
}

export type StreamInfo = {
  id: string;
  added: number;
}

export class TwitchStreamNotifier {
  private interval: number;
  private loggedStreams: StreamInfo[] = [];
  private timer: ReturnType<typeof setInterval> | undefined = undefined;
  private callback?: (a: TwitchStreamResponseJSON) => void;

  public constructor(callback: (a: TwitchStreamResponseJSON) => void, interval = defaultInterval) {
    this.interval = interval;
    this.callback = callback;
  }

  public start (): void {
    this.timer = setInterval(this.checkForStreams.bind(this), this.interval);
  }

  public stop (): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private checkForStreams (): void {
    TwitchApi.getActiveStreams().then(response => {
      if (response.status === ApiResponseStatus.SUCCESS && response.data) {
        response.data.forEach(stream => {
          const foundIndex = this.loggedStreams.findIndex(s => s.id === stream.id);
  
          if (foundIndex === -1) {
            this.loggedStreams.push({
              id: stream.id,
              added: new Date().getTime()
            });
  
            if (this.callback) this.callback(stream);
          }
        });
      }
    });
  }
}