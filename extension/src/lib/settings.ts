import { DraftEngine } from './draft';

export interface DraftSettings {
  engine: DraftEngine;
  hfApiKey: string;
}

export function getDraftSettings(): Promise<DraftSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ engine: 'rule', hfApiKey: '' }, (res) => {
      resolve(res as DraftSettings);
    });
  });
}

export function saveDraftSettings(settings: DraftSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(settings, () => resolve());
  });
}
