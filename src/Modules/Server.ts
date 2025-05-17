// API References
import express from 'express';
import fetch from 'node-fetch';

// Modules
import { log } from './Diagnostics.ts';

// HTML (source code)
// HTML source for the homepage
const homepage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lynx - Discord Bot</title>
    <style>
      * {
        margin: 0;
        padding: 0;

        color: white;
        background-color: #1a1a1a;
      }

      body {
        font-family: Oxygen, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        max-width: 600px;
      }

      .buttons {
        display: flex;
        gap: 1rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s;
      }

      .btn-primary {
        color: black;
        background-color: white;
      }

      .btn-primary:hover {
        background-color: #9ca3af;
      }

      .btn-secondary {
        border: 1px solid #9ca3af;
        background-color: transparent;
      }

      .btn-secondary:hover {
        border: 1px solid white;
      }
    </style>
  </head>
  <body>
    <h1>Lynx</h1>
    <p>Lightweight. Secure. Sharp. </p>

    <div class="buttons">
      <a href="/getting-started" class="btn btn-primary">Get started</a>
      <a href="https://github.com/VisoredPrograms/lynx" class="btn btn-secondary">Source code</a>
    </div>
  </body>
</html>
`;

// HTML source for the homepage
const getting_started = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lynx - Getting Started</title>
    <style>
      * {
        margin: 0;
        padding: 0;

        color: white;
        background-color: #1a1a1a;
      }

      body {
        font-family: Oxygen, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        max-width: 600px;
      }
      </style>
  </head>
  <body>
    <h1>Getting Started</h1>
    <p>Docs are being developed and will be released soon; we appreciate your patience as we prepare clear and comprehensive materials.</p>
  </body>
</html>
`;

// Check required environment variables
// Environment variables
const host = process.env.SERVER_URL || '';
const port = Number(process.env.PORT) || 8080;
const interval = 10 * 60 * 1000; // 10 minutes

// Helpers

// Sends periodic requests to keep the server active
function ping() {
  fetch(host)
    .then((res) => log('info', `Pinged ${host}. Status Code: ${res.status}`))
    .catch((err) => log('error', `Could not ping: ${host}. Error: ${err.message}`));
}

// Main Functions

/**
 * Starts the Express server, serves HTML pages,
 * and sets up periodic keep-alive pings.
 */
export function serve() {
  const app = express();

  if (host && host != '') {
    setInterval(ping, interval);
  }

  app.get('/', (req, res) => {
    res.send(homepage);
  });

  app.get('/getting-started', (req, res) => {
    res.send(getting_started);
  });

  app.listen(port, () => {
    log('info', `Server started on http://localhost:${port}/`);
  });
}
