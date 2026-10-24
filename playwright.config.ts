import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const TELEGRAM_MOCK_PORT = 4010

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      // Fake Telegram Bot API: the real one is never called in tests.
      command: 'node e2e/support/telegram-mock.mjs',
      url: `http://localhost:${TELEGRAM_MOCK_PORT}/__messages`,
      reuseExistingServer: !process.env.CI,
    },
    {
      // Needs a migrated and seeded database (DATABASE_URI, PAYLOAD_SECRET).
      command: 'npm run build && npm run start',
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: {
        ...process.env,
        TELEGRAM_BOT_TOKEN: 'test-token',
        TELEGRAM_CHAT_ID: '1',
        TELEGRAM_API_URL: `http://localhost:${TELEGRAM_MOCK_PORT}`,
      },
    },
  ],
})
