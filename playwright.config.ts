import { defineConfig, devices } from "@playwright/test";

// Override with PORT=3000 to run against an already-running `next dev` (the
// webServer block reuses it outside CI).
const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "./tests",
  // Only *.spec.ts are Playwright specs. Without this, the default testMatch also
  // picks up the node:test unit tests (*.test.mjs), which Playwright's loader
  // can't run — see the "Run:" comment at the top of tests/rate-limit.test.mjs.
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
