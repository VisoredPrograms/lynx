// API References
import { Client, Collection } from 'discord.js';

// Interfaces
import type { ClientSettings } from './ClientSettings.ts';
import type { Command } from './Command.ts';
import type { Command as InteractionCommand } from './Interaction.ts';

// Interface
export interface ExtendedClient extends Client {
  Options: ClientSettings;
  Commands: Collection<string, Command>;
  Interactions: Collection<string, InteractionCommand>;
  Cooldowns: Collection<string, number>;
}
