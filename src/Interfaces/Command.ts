// API References
import { Message } from 'discord.js';

// Interface
export interface Command {
  name: string;
  cooldown: number;
  description: string;
  usage: string;
  category: string;
  permissions?: bigint[];
  execute: (message: Message, args: string[]) => void | Promise<void>;
}
