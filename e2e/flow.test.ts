import { test, expect, chromium, Page, BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import http from 'http';

const extensionPath = path.join(__dirname, '../extension');

function serveFixture(): Promise<{ server: http.Server; url: string }> {
  const fixture = fs.readFileSync(path.join(__dirname, 'job.html'));
  return new Promise((resolve) => {
    const server = http
      .createServer((_, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fixture);
      })
      .listen(0, () => {
        const { port } = server.address() as any;
        resolve({ server, url: `http://localhost:${port}` });
      });
  });
}

test('detect draft send flow', async () => {
  const { server, url } = await serveFixture();

  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  await context.route('https://api-inference.huggingface.co/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ text: 'Hi Recruiter' }] }),
    });
  });

  let gmailBody: string | null = null;
  await context.route('https://gmail.googleapis.com/**', (route) => {
    gmailBody = route.request().postData() || null;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"id":"1"}',
    });
  });

  const bg =
    context.serviceWorkers()[0] ||
    (await context.waitForEvent('serviceworker'));
  const extensionId = bg.url().split('/')[2];
  await bg.evaluate(() =>
    chrome.storage.local.set({ engine: 'huggingface', hfApiKey: 'test' }),
  );

  const page = await context.newPage();
  await page.goto(url);

  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  await popup.getByText('Detect Company').click();
  await popup.getByText('Send referral requests').click();

  await expect.poll(() => gmailBody !== null).toBe(true);

  const raw = JSON.parse(gmailBody!).raw;
  const decoded = Buffer.from(raw, 'base64url').toString('utf8');
  expect(decoded).toContain('To: recruiter@example.com');
  expect(decoded).toContain('Hi Recruiter');
  expect(decoded).toContain('Acme Corp');

  await context.close();
  server.close();
});
