import { Client, Message } from 'discord.js';
import { TwitchApi } from '../api/TwitchApi';
import { SupporterRoles } from './SupporterRoles';
import { getTwitchChatMessage } from './TwitchStreamNotifier';

enum AllowedCommands {
  TWITCH = '!twitch',
  UPDATE_SUPPORTER_ROLE = '!supporterrole'
}

export class BotCommandHandler {
  private client?: Client;

  public registerClient (client: Client): void {
    this.client = client;
  }

  public handle(message: Message): void {
    if (!this.client) return;
    if (message.channel.id === '917563254832791632' && message.content.startsWith('!')) {
      let command = message.content.substr(0, message.content.indexOf(' '));
      let parameter = message.content.substr(message.content.indexOf(' ') + 1);
      if (!command) {
        command = parameter;
        parameter = undefined;
      }

      switch(command) {
        case AllowedCommands.TWITCH: this.postTwitchStreams(message); break;
        case AllowedCommands.UPDATE_SUPPORTER_ROLE: this.updateSupporterRole(message); break;
        // default: this.postUnknownCommand(message);
      }
    }
  }

  private postUnknownCommand (message: Message): void {
    message.channel.send('I don\'t know this command :(');
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

  private updateSupporterRole (message: Message): void {
    SupporterRoles.updateSupporterRole(message, message.mentions.members.first() ?? message.member);
  }
}

