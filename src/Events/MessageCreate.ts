// API References
import { scheduler } from 'node:timers/promises';
import { Events, Message } from 'discord.js';

// Modules
import client from '../App.ts';
import { log } from '../Modules/Diagnostics.ts';

// Interfaces
import type { Event } from '../Interfaces/Event.ts';

// Settings
const PREFIX = client.Options.Prefix;

// Define the messageCreate event handler
const MessageCreate: Event<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (!message.guild) return;
    if (!message.member || message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.Commands.get(commandName);
    if (!command) return;

    if (command.permissions) {
      const memberPermissions = message.member.permissions;
      const hasPermissions = memberPermissions.has(command.permissions, false);

      if (!hasPermissions) {
        const reply = await message.reply("You don't have permission to use this command!");
        scheduler
          .wait(2_500)
          .then(() => reply.delete())
          .catch(() => {});
        return;
      }
    }

    const id = commandName + '-' + message.author.id;
    const start = client.Cooldowns.get(id);

    if (start) {
      const expiryTime = Math.floor((start + command.cooldown * 1000) / 1000);
      const reply = await message.reply(
        `Please wait, you are on a cooldown for \`${commandName}\`. You can use it again <t:${expiryTime}:R>.`,
      );

      await scheduler.wait(command.cooldown * 1000 - 1000);
      await reply.delete().catch(() => {});
    }

    client.Cooldowns.set(id, Date.now());

    scheduler
      .wait(command.cooldown * 1000)
      .then(() => client.Cooldowns.delete(id))
      .catch(() => {});

    try {
      await command.execute(message, args);
    } catch (err: unknown) {
      log('error', String(err));
      await message.reply('An error occured while executing a command.');
    }
  },
};

export default MessageCreate;
