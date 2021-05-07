import { Client, Message } from 'discord.js';
import { TwitchApi } from '../api/TwitchApi';
import { getTwitchChatMessage } from './TwitchStreamNotifier';

enum AllowedCommands {
  TWITCH = '!twitch'
}

export class BotCommandHandler {
  private client?: Client;

  public registerClient (client: Client): void {
    this.client = client;
  }

  public handle(message: Message): void {
    if (!this.client) return;
    if (message.content.startsWith('!')) {
      switch(message.content) {
        case AllowedCommands.TWITCH: this.postTwitchStreams(message); break;
        default: this.postUnknownCommand(message);
      }
    }
  }

  private postUnknownCommand (message: Message): void {
    // message.channel.send('I don\'t know this comman :[');
  }

  private postTwitchStreams (message: Message): void {
    TwitchApi.getActiveStreams().then(response => {
      if (response.streams.length === 0) {
        message.channel.send('There isn\'t anyone streaming geotastic at the moment. Cruel world.');
      } else {
        const lines: string[] = [];
        response.streams.forEach(stream => {
          lines.push(getTwitchChatMessage(stream));
        });
        message.channel.send(lines.join('\n'));
      }
    }).catch(() => {
      message.channel.send('I don\'t have a connection to twitch api :(');
    });
  }
}