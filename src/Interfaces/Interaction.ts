// API References
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

// Interface
export interface Command {
  data: SlashCommandBuilder;
  cooldown: number;
  execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>;
}
