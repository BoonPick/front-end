import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173', headless: true, trace: 'off' },
  webServer: {
    command: 'yarn dev --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  reporter: [['json', { outputFile: '/tmp/p1_e2e.json' }], ['list']],
});
