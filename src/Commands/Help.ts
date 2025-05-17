// API References
import { scheduler } from 'node:timers/promises';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';

// Modules
import client from '../App.ts';
import { toTitleCase } from '../Modules/Formatters.ts';

// Interfaces
import type { Message } from 'discord.js';
import type { Command } from '../Interfaces/Command.ts';

// Main Functions
const Help: Command = {
  name: 'help',
  cooldown: 5,
  description: 'No data found.',
  usage: 'help',
  category: 'Utility',
  execute: async (message: Message, args: string[]): Promise<void> => {
    if (!client.user) return;

    const commandName = args[0]?.toLowerCase();
    if (commandName && !client.Commands.has(commandName)) {
      const reply = await message.reply("That's not a valid command.");
      scheduler
        .wait(2_500)
        .then(() => reply.delete())
        .catch(() => {}); // Ignore any errors from reply or delete
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setFooter({
        text: client.user.username + ' v1.0',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (commandName) {
      const command = client.Commands.get(commandName);
      if (command) {
        embed
          .setTitle(toTitleCase(command.name))
          .setDescription(
            `**Description**: ${command.description}\n**Usage**: \`${client.Options.Prefix}${
              command.usage
            }\`\n**Permissions**: ${
              new PermissionsBitField(command.permissions).toArray().join(', ') || 'None'
            }`,
          );
      } else {
        embed.setTitle('N/A').setDescription('Command not found.');
      }
    } else {
      const categories = new Map<string, string[]>();

      client.Commands.forEach((command, name) => {
        const category = command.category;
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)?.push(name);
      });

      categories.forEach((commands, category) => {
        embed.addFields({
          name: `${category} (${commands.length})`,
          value: commands.map((name) => `\`${name}\``).join(', ') || 'None',
        });
      });
    }

    // Reply with the embed
    message.reply({ embeds: [embed] }).catch(() => {});
  },
};

export default Help;
