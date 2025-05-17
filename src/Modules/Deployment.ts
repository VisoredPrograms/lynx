// API References
import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { readdir } from 'node:fs/promises';

// Modules
import { log } from './Diagnostics.ts';
import { removeExtension } from '../Modules/Formatters.ts';

dotenv.config();

// Check required environment variables
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  log('info', 'Error: DISCORD_TOKEN is not set.');
  process.exit(1);
}

// Settings
const __dirname = dirname(fileURLToPath(import.meta.url));
const COMMANDS_PATH = join(__dirname, '../Interactions');
const VALID_EXTENSIONS = new Set(['.ts', '.js']);

// Variables
const rest = new REST().setToken(TOKEN);
const commands: any[] = [];

// Read and filter command files
let commandFiles = await readdir(COMMANDS_PATH);
commandFiles = commandFiles.filter((file) => VALID_EXTENSIONS.has(`.${file.split('.').pop()}`));

// Deploy application (/) commands to Discord
export async function deployCommands() {
  try {
    // Import commands and add to commands array
    await Promise.all(
      commandFiles.map(async (file) => {
        try {
          const filePath = join(COMMANDS_PATH, file);
          const fileUrl = pathToFileURL(filePath).href;

          const module = await import(fileUrl);
          commands.push(module.default.data.toJSON());
        } catch (err) {
          log('error', `Failed to load ${removeExtension(file)}: ${err}`);
        }
      }),
    );

    log('info', `Started refreshing ${commands.length} application (/) commands.`);

    const APP_ID = process.env.DISCORD_APPLICATION_ID;
    if (!APP_ID) {
      log('info', 'Error: DISCORD_APPLICATION_ID is not set.');
      process.exit(1);
    }

    // Deploy commands globally to Discord
    const data: any = await rest.put(Routes.applicationCommands(APP_ID), { body: commands });

    log('info', `Successfully reloaded ${data.length || 0} application (/) commands.`);
  } catch (err) {
    console.error('An error occurred:', err);
  }
}
