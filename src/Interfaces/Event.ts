// API References
import type { ClientEvents } from 'discord.js';

// Interface
export interface Event<K extends keyof ClientEvents> {
  name: string;
  once?: boolean;
  execute: (...args: ClientEvents[K]) => void | Promise<void>;
}
