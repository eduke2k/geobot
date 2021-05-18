import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { TwitchApi, TwitchStreamResponseJSON } from '../api/TwitchApi';

// Defaults to 5min
const defaultInterval = 0.5 * 60 * 1000;

export function getTwitchChatMessage (stream: TwitchStreamResponseJSON): string {
  return `**${stream.channel.name}** is streaming for **${stream.viewers} viewers**. Say hello: ${stream.channel.url}`;
}

export function getTwitchEmbedOptions (stream: TwitchStreamResponseJSON): MessageEmbedOptions {
  return {
    color: 0x0099ff,
    title: stream.channel.status,
    url: stream.channel.url,
    author: {
      name: stream.channel.name,
      iconURL: stream.channel.logo,
      url: stream.channel.url,
    },
    thumbnail: {
      url: stream.channel.logo,
    },
    fields: [
      {
        name: 'Game',
        value:  stream.channel.game,
        inline: false
      },
      {
        name: 'Viewers',
        value: stream.channel.url,
        inline: false
      }
    ],
    image: {
      url: stream.channel.video_banner,
    }
  };
}

export type StreamInfo = {
  id: number;
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
      response.streams.forEach(stream => {
        const foundIndex = this.loggedStreams.findIndex(s => s.id === stream._id);

        if (foundIndex === -1) {
          this.loggedStreams.push({
            id: stream._id,
            added: new Date().getTime()
          });

          if (this.callback) this.callback(stream);
        }
      });
    });
  }
}