// API References
import { Client, Collection } from 'discord.js';

// Interfaces
import type { ClientSettings } from '../Interfaces/ClientSettings.ts';
import type { Command } from '../Interfaces/Command.ts';
import type { Command as InteractionCommand } from '../Interfaces/Interaction.ts';

// Class
class ExtendedClient extends Client {
  Options: ClientSettings;
  Commands: Collection<string, Command>;
  Interactions: Collection<string, InteractionCommand>;
  Cooldowns: Collection<string, number>;

  constructor(options: ClientSettings) {
    const intents = options.Intents;
    super({ intents });

    this.Options = options;
    this.Commands = new Collection();
    this.Interactions = new Collection();
    this.Cooldowns = new Collection();
  }
}

export default ExtendedClient;
