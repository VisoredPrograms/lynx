// API References
import { GatewayIntentBits } from 'discord.js';

// Interface
export interface ClientSettings {
  Prefix: string;
  Intents: GatewayIntentBits[];
}
