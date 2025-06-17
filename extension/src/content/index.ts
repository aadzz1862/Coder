function scrapeCompany(): string {
  const meta = document.querySelector(
    'meta[property="og:site_name"]',
  ) as HTMLMetaElement | null;
  if (meta?.content) return meta.content;
  const el = document.querySelector('[data-company-name]');
  return el ? (el.textContent || '').trim() : '';
}

function scrapeContacts(): Array<{
  name: string;
  email: string | null;
  title?: string;
}> {
  const emails: Array<{ name: string; email: string | null; title?: string }> =
    [];
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    const email = (a as HTMLAnchorElement).href.replace('mailto:', '');
    const name = (a.textContent || '').trim();
    emails.push({ name, email, title: undefined });
  });
  return emails;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_COMPANY_NAME') {
    sendResponse({ companyName: scrapeCompany() });
    return true;
  }
  if (msg.type === 'SCRAPE_LEADS') {
    const company = scrapeCompany();
    const leads = scrapeContacts().map((c) => ({
      ...c,
      source: 'page' as const,
    }));
    chrome.runtime.sendMessage({
      type: 'LEADS_FROM_PAGE',
      companyName: company,
      leads,
    });
    return true;
  }
  return false;
});

console.log('Content script loaded');
