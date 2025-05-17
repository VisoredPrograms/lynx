// API References
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// Modules
import client from '../App.ts';
import { formatShortDate } from '../Modules/Formatters.ts';

// Interfaces
import type { ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../Interfaces/Interaction';

const Ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription("Checks client's response time."),
  cooldown: 5,
  async execute(interaction: ChatInputCommandInteraction) {
    const startTime = Date.now();

    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

    await interaction.reply({
      content: 'Pinging.',
      ephemeral: true,
    });

    const embed = new EmbedBuilder()
      .setTitle(greeting + '!')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        'Send-Receive Time: ' +
          (Date.now() - startTime) +
          'ms\nWebSocket Ping: ' +
          client.ws.ping +
          'ms',
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        text:
          'ID: ' + interaction.user.id.toString() + ' | Created At: ' + formatShortDate(new Date()),
      });

    await interaction.editReply({ content: '', embeds: [embed] }).catch(() => {});
  },
};

export default Ping;
