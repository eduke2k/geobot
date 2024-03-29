import { Client, GatewayIntentBits, Message } from 'discord.js';
import { TwitchStreamResponseJSON } from '../api/TwitchApi';
import { BotCommandHandler } from './MessageHandler';
import { getTwitchChatMessage, getTwitchEmbedOptions, TwitchStreamNotifier } from './TwitchStreamNotifier';

export class Geobot {
  private readonly token: string;
  private client?: Client;
  private commandHandler = new BotCommandHandler();

  public constructor (token: string) {
    this.token = token;
  }

  public async sayHello (): Promise<void> {
    const channel = await this.client.channels.fetch('840322343867383848');
    if (channel && channel.isTextBased()) {
      channel.send('I\'m online!');
    }
  }

  public async sendTwitchNotification(stream: TwitchStreamResponseJSON): Promise<void> {
    const channel = await this.client.channels.fetch('840709055151603772');
    if (channel && channel.isTextBased()) {
      channel.send({ content: getTwitchChatMessage(stream), embeds: [getTwitchEmbedOptions(stream)]});
    }
  }

  public start (): Promise<string> {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

    // Register message handler for bot commands
    this.commandHandler.registerClient(this.client);
    
    // Start automatic twitch notifier
    const twitchNotifier = new TwitchStreamNotifier(this.sendTwitchNotification.bind(this));
    twitchNotifier.start();

    // Send all messages to message handler
    this.client.on('messageCreate', (message: Message) => {
      this.commandHandler.handle(message);
    });

    return this.client.login(this.token);
  }
}
