import { GuildMember, Message } from 'discord.js';
import { ApiResponseStatus, GeotasticApi } from '../api/GeotasticApi';

export class SupporterRoles {
  public static updateSupporterRole (message: Message, member: GuildMember): void {
    const sad = message.guild.emojis.cache?.find(emoji => emoji.name === 'sadpotat');

    GeotasticApi.getSupporterLevel(member.user.tag)
    .then(r => {
      if (r.status === ApiResponseStatus.SUCCESS && r.data !== undefined) {
        const supporterLevel = r.data;
        SupporterRoles.updateRoles(message, member, supporterLevel).then(() => {
          SupporterRoles.sendAnswer(message, member, supporterLevel);
        }).catch(e => {
          message.channel.send(`Could not update supporter role for ${member.user.tag} ${sad} ${e}`);
        });
      } else {
        message.channel.send(`Could not update supporter role for ${member.user.tag} ${sad} ${r.message}`);
      }
    })
    .catch(e => {
      message.channel.send(`Could not update supporter role for ${member.user.tag} ${sad}`);
      console.error(e);
    });
  }

  private static async updateRoles(message: Message, member: GuildMember, level: number): Promise<void> {
    // Fetch roles
    const tier1Role = message.guild.roles.cache.find(r => r.name === 'supporter-tier-1');
    const tier2Role = message.guild.roles.cache.find(r => r.name === 'supporter-tier-2');
    const tier3Role = message.guild.roles.cache.find(r => r.name === 'supporter-tier-3');

    // First remove all supporter roles from user
    await member.roles.remove([tier1Role, tier2Role, tier3Role]);

    // Add level specific supporter role afterwards
    switch (level) {
      case 1:
      case 2: await member.roles.add(tier1Role); break;
      case 3:
      case 4: await member.roles.add(tier2Role); break;
      case 5:
      case 6: await member.roles.add(tier3Role); break;
    }
  }

  private static sendAnswer(message: Message, member: GuildMember, level: number): void {
    const sad = message.guild.emojis.cache?.find(emoji => emoji.name === 'sadpotat');
    const drumming = message.guild.emojis.cache?.find(emoji => emoji.name === 'drumming');

    switch (level) {
      case 0: message.channel.send(`${member.toString()} You are not a supporter... yet! ${sad}`); break;
      case 1: message.channel.send(`${member.toString()} You are supporter level 1, which grants you the supporter tier 1 role! ${drumming}`); break;
      case 2: message.channel.send(`${member.toString()} You are supporter level 2, which grants you the supporter tier 1 role! ${drumming}`); break;
      case 3: message.channel.send(`${member.toString()} You are supporter level 3, which grants you the supporter tier 2 role! ${drumming}`); break;
      case 4: message.channel.send(`${member.toString()} You are supporter level 4, which grants you the supporter tier 2 role! ${drumming}`); break;
      case 5: message.channel.send(`${member.toString()} You are supporter level 5, which grants you the supporter tier 3 role! ${drumming}`); break;
      case 6: message.channel.send(`${member.toString()} You are supporter level 6, which grants you the supporter tier 3 role! ${drumming}`); break;
    }
  }
}