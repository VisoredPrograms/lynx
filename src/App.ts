/**
 *
 *     /'\_/`\            __
 *    / \      \     __   /\_\    ___
 *    \ \ \__\ \  /'__`\ \/\ \ /' _ `\
 *     \ \ \_/\ \/\ \L\.\_\ \ \/\ \/\ \
 *      \ \_\\ \_\ \__/.\_\\ \_\ \_\ \_\
 *       \/_/ \/_/\/__/\/_/ \/_/\/_/\/_/
 *
 *  Entry-point
 *  - Project: App
 *  - Description: Manages ccommands, databases and logins.
 *  - Language: Typescript (Node 22.14.x)
 *  - Status: Active
 *  - Environment: Cross-platform
 *
 *   __  __                                      __  ____
 *  /\ \/\ \  __                                /\ \/\  _`\
 *  \ \ \ \ \/\_\    ____    ___   _ __    __   \_\ \ \ \L\ \_ __   ___      __   _ __    __      ___ ___     ____
 *   \ \ \ \ \/\ \  /',__\  / __`\/\`'__\/'__`\ /'_` \ \ ,__/\`'__\/ __`\  /'_ `\/\`'__\/'__`\  /' __` __`\  /',__\
 *    \ \ \_/ \ \ \/\__, `\/\ \L\ \ \ \//\  __//\ \L\ \ \ \/\ \ \//\ \L\ \/\ \L\ \ \ \//\ \L\.\_/\ \/\ \/\ \/\__, `\
 *     \ `\___/\ \_\/\____/\ \____/\ \_\\ \____\ \___,_\ \_\ \ \_\\ \____/\ \____ \ \_\\ \__/.\_\ \_\ \_\ \_\/\____/
 *     `\/__/  \/_/\/___/  \/___/  \/_/ \/____/\/__,_ /\/_/  \/_/ \/___/  \/___L\ \/_/ \/__/\/_/\/_/\/_/\/_/\/___/
 *                                                                         /\____/
 *                                                                         \_/__/
 *
 *  AUTHOR
 *  - README by @VisoredPrograms
 *  - Last updated 05/17/24
 *  - Maintainer: VisoredPrograms (Software Engineer, UK)
 *  - License: MIT
 *
 */

// API References
// import dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';

// Modules
import { log } from './Modules/Diagnostics.ts';
import { Register } from './Modules/Handler.ts';
import { deployCommands } from './Modules/Deployment.ts';
import { serve } from './Modules/Server.ts';

// Classes
import ExtendedClient from './Structures/ExtendedClient.ts';

// Init
// dotenv.config();

// Settings
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

// Check required environment variables
// Environment variables
const token = process.env.DISCORD_TOKEN || '';
const database_key = process.env.DATABASE_PUBLIC_KEY || '';

const prefix = process.env.DISCORD_PREFIX || ':?';
if (!prefix) {
  log('info', 'Error: DISCORD_PREFIX is not set.');
  process.exit(1);
}

// Variables
const client = new ExtendedClient({ Prefix: prefix, Intents: intents });
export default client;

// Main Functions
// Set up commands, database, and login
async function init() {
  deployCommands();
  Register(client);

  if (database_key && database_key != '') {
    mongoose.connect(database_key as string).catch((err) => log('error', err));
  }

  client.login(token);
}

// Main execution
if (import.meta.url) {
  // Code to execute when the script is run directly
  init();

  // Start Express server
  serve();
}
