import { findLeads, Lead } from '../lib/leadFinder';
import { draftWithHF, draftWithRule } from '../lib/draft';
import { sendEmail } from '../lib/gmail';
import { getDraftSettings } from '../lib/settings';

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background service worker installed');
});

async function handleLeads(company: string, onPage: Lead[]) {
  const leads = await findLeads(company, onPage);
  const { engine, hfApiKey } = await getDraftSettings();
  let draft: string;
  if (engine === 'huggingface' && hfApiKey) {
    try {
      draft = await draftWithHF(company, hfApiKey);
    } catch (e) {
      console.error(e);
      draft = draftWithRule(company);
    }
  } else {
    draft = draftWithRule(company);
  }
  const queueItems = leads.map((l) => ({ ...l, draft }));
  const sendPromises = queueItems
    .filter((l) => l.email)
    .map((l) =>
      sendEmail(l.email!, `Referral request for ${company}`, l.draft),
    );

  await Promise.all(sendPromises);

  return new Promise<void>((resolve) => {
    chrome.storage.local.get({ leadQueue: [] }, (res) => {
      const queue = Array.isArray(res.leadQueue) ? res.leadQueue : [];
      queue.push(...queueItems);
      chrome.storage.local.set({ leadQueue: queue }, () => resolve());
    });
  });
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'LEADS_FROM_PAGE') {
    handleLeads(msg.companyName, msg.leads).then(() =>
      sendResponse({ ok: true }),
    );
    return true;
  }
  return false;
});
