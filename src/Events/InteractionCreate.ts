// API References
import { scheduler } from 'node:timers/promises';
import { Events } from 'discord.js';
import type { Interaction, CacheType } from 'discord.js';

// Modules
import client from '../App.ts';

// Interfaces
import type { Message } from 'discord.js';
import type { Event } from '../Interfaces/Event.ts';
// Constants
const ERROR_RESPONSE = {
  content: 'There was an error while executing this command!',
  ephemeral: true,
};

// Define the interactionCreate event handler
const InteractionCreate: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    if (!client.user) {
      await interaction.reply({
        content: 'Commands may only be executed once the bot is accessible.',
        ephemeral: true,
      });
      return;
    }

    const command = client.Interactions.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: 'No command matching ' + interaction.commandName + ' was found.',
        ephemeral: true,
      });
      return;
    }

    const cooldownId = interaction.commandName + '-' + interaction.user.id;
    const startTime = client.Cooldowns.get(cooldownId);

    // Check if the cooldown is active
    if (startTime) {
      const expiryTime = Math.floor((startTime + command.cooldown * 1000) / 1000); // Use Math.ceil for clarity
      interaction.reply({
        content: `Please wait, you are on a cooldown for \`${interaction.commandName}\`. You can use it again <t:${expiryTime}:R>.`,
        ephemeral: true,
      });
      return; // Cooldown is still active, so exit early
    }

    // Set the cooldown placeholder in the client.Cooldowns
    client.Cooldowns.set(cooldownId, Date.now()); // Using a Set, or set the value to `true` if using a Map

    // Automatically delete the cooldown when it expires
    scheduler
      .wait(command.cooldown * 1_000)
      .then(() => client.Cooldowns.delete(cooldownId))
      .catch(() => {});

    try {
      await command.execute(interaction);
    } catch (_) {
      await (interaction.replied || interaction.deferred
        ? interaction.followUp(ERROR_RESPONSE)
        : interaction.reply(ERROR_RESPONSE));
    }
  },
};

export default InteractionCreate;
