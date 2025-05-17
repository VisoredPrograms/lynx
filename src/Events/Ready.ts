// API References
import { Client, Events } from 'discord.js';

// Modules
import Bot from '../App.ts';
import { log } from '../Modules/Diagnostics.ts';

// Interfaces
import type { Event } from '../Interfaces/Event.ts';

const Ready: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true, // This event will only trigger once
  execute: (client: Client) => {
    if (!client.user) {
      log('error', 'The bot is not accessible.');
      return;
    }

    log('info', 'Ready! Logged in as ' + client.user.tag);
    client.user.setActivity(Bot.Options.Prefix + 'help'); // Set the bot's activity to show the help command
  },
};

// Export the ready event handler
export default Ready;
