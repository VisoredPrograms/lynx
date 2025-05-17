// API References
import { Events, Message } from 'discord.js';

// Modules
import client from '../App.ts';

// Interfaces
import type { Event } from '../Interfaces/Event';

// Define the messageCreate event handler
const MessageCreate: Event<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (client.user && message.mentions.has(client.user)) {
      // Client was mentioned, respond accordingly
      message.reply('Hey, you mentioned me!');
    }
  },
};

export default MessageCreate;
