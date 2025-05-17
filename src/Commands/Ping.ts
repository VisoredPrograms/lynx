// Interfaces
import type { Message } from 'discord.js';
import type { Command } from '../Interfaces/Command.ts';

// Main Functions
const Ping: Command = {
  name: 'ping',
  cooldown: 5,
  description: 'Replies with Pong!',
  usage: 'ping',
  category: 'Utility',
  execute: async (message: Message): Promise<void> => {
    message.reply('Pong!');
  },
};

export default Ping;
