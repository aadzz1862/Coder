import { getDraftSettings, saveDraftSettings } from '../lib/settings';
import { DraftEngine } from '../lib/draft';

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await getDraftSettings();
  (document.getElementById('engine') as HTMLSelectElement).value =
    settings.engine;
  (document.getElementById('apiKey') as HTMLInputElement).value =
    settings.hfApiKey;
});

document.getElementById('save')?.addEventListener('click', async () => {
  const engine = (document.getElementById('engine') as HTMLSelectElement)
    .value as DraftEngine;
  const apiKey = (document.getElementById('apiKey') as HTMLInputElement).value;
  await saveDraftSettings({ engine, hfApiKey: apiKey });
});
