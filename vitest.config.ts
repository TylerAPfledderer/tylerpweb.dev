import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        // Pre-bundle the JSX runtimes. Vite otherwise discovers react/jsx-dev-runtime
        // *during* the run, re-optimizes, and reloads mid-test — which kills the in-flight
        // import of addon-vitest's setup file:
        //   Failed to fetch dynamically imported module:
        //     .../vitest-plugin/setup-file-with-project-annotations.js
        // Vitest says so itself: "Vite unexpectedly reloaded a test ... please add
        // mentioned dependencies to your config's optimizeDeps.include field manually."
        //
        // Only bites on a COLD dep cache — which is every CI run (`bun install` first) and
        // any local run after an install. A warm cache passes without this, which is
        // exactly why it looks unnecessary until CI goes red.
        optimizeDeps: {
          include: ['react/jsx-dev-runtime', 'react/jsx-runtime'],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
