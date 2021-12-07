import { Client, Message } from 'discord.js';
import { TwitchApi } from '../api/TwitchApi';
import { ALLOWED_CHANNELS } from '../const';
import { SupporterRoles } from './SupporterRoles';
import { getTwitchChatMessage } from './TwitchStreamNotifier';

enum AllowedCommands {
  TWITCH = '!twitch',
  COMMANDS = '!commands',
  UPDATE_SUPPORTER_ROLE = '!supporterrole'
}

export class BotCommandHandler {
  private client?: Client;

  public registerClient (client: Client): void {
    this.client = client;
  }

  public handle(message: Message): void {
    if (!this.client) return;
    if (ALLOWED_CHANNELS.includes(message.channel.id) && message.content.startsWith('!')) {
      let command = message.content.substr(0, message.content.indexOf(' '));
      let parameter = message.content.substr(message.content.indexOf(' ') + 1);
      if (!command) {
        command = parameter;
        parameter = undefined;
      }

      switch(command) {
        case AllowedCommands.TWITCH: this.postTwitchStreams(message); break;
        case AllowedCommands.COMMANDS: this.showCommands(message); break;
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

  private showCommands (message: Message): void {
    message.channel.send('`!supporterrole`: Will automatically assign your discord account the proper supporter role if you have your discord handle attached to your geotastic account.');
  }

  private updateSupporterRole (message: Message): void {
    SupporterRoles.updateSupporterRole(message, message.mentions.members.first() ?? message.member);
  }
}

