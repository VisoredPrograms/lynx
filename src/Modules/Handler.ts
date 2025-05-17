// API References
import { join, dirname } from 'path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
import { log } from './Diagnostics.ts';

// Modules
import { removeExtension } from './Formatters.ts';

// Interfaces
import BaseExtendedClient from '../Structures/ExtendedClient.ts';
import type { Event } from '../Interfaces/Event.ts';
import type { Command } from '../Interfaces/Command.ts';
import type { Command as InteractionCommand } from '../Interfaces/Interaction.ts';

// Settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATHS = {
  events: join(__dirname, '../Events'),
  commands: join(__dirname, '../Commands'),
  app_commands: join(__dirname, '../Interactions'),
} as const;

const VALID_EXTENSIONS = new Set(['.ts', '.js']);

// Return files with valid extensions from a directory
async function getFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir);
  return files.filter((file) => VALID_EXTENSIONS.has(`.${file.split('.').pop()}`));
}

// Import a module and return its default export
async function getModule<T>(dir: string, file: string): Promise<T | undefined> {
  try {
    const filePath = join(dir, file);
    const fileUrl = pathToFileURL(filePath).href;
    return (await import(fileUrl)).default;
  } catch (err) {
    log('error', `Failed to load ${removeExtension(file)}: ${err}`);
  }
}

// Load and register all event handlers
async function loadEvents(client: BaseExtendedClient): Promise<void> {
  const files = await getFiles(PATHS.events);

  await Promise.all(
    files.map(async (file) => {
      const event = await getModule<Event<any>>(PATHS.events, file);
      if (!event) return;

      const handler = (...args: unknown[]) => event.execute(...args);
      client[event.once ? 'once' : 'on'](event.name, handler);

      // log('info', `${removeExtension(file)} event loaded.`);
    }),
  );
}

// Load and register all prefix-based commands
async function loadCommands(client: BaseExtendedClient): Promise<void> {
  const files = await getFiles(PATHS.commands);

  await Promise.all(
    files.map(async (file) => {
      const command = await getModule<Command>(PATHS.commands, file);
      if (!command) return;

      client.Commands.set(command.name, command);

      // log('info', `${removeExtension(file)} command loaded.`);
    }),
  );
}

// Load and register all slash commands
async function loadInteractions(client: BaseExtendedClient): Promise<void> {
  const files = await getFiles(PATHS.app_commands);

  await Promise.all(
    files.map(async (file) => {
      const command = await getModule<InteractionCommand>(PATHS.app_commands, file);
      if (!command) return;

      client.Interactions.set(command.data.name, command);

      // log('info', `${removeExtension(file)} interaction loaded.`);
    }),
  );
}

// Register all handlers (events, commands, interactions)
export async function Register(client: BaseExtendedClient): Promise<void> {
  await Promise.all([loadEvents(client), loadCommands(client), loadInteractions(client)]);
}
