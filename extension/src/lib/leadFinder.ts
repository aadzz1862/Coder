export interface Lead {
  name: string;
  email: string | null;
  title?: string;
  source: 'page' | 'hunter' | 'clearbit' | 'linkedin';
}

export const MAX_LINKEDIN_CALLS_PER_DAY = 150;
const LINKEDIN_CALLS_KEY = 'linkedinCallsToday';

/** Try to fetch leads from Hunter.io API */
async function fetchHunterLeads(company: string): Promise<Lead[]> {
  const apiKey = 'YOUR_HUNTER_API_KEY';
  const res = await fetch(
    `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(company)}&limit=3&api_key=${apiKey}`,
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    data: {
      emails: Array<{
        first_name: string;
        last_name: string;
        position: string;
        value: string;
      }>;
    };
  };
  return (data.data.emails || []).map((e) => ({
    name: `${e.first_name} ${e.last_name}`.trim(),
    email: e.value,
    title: e.position,
    source: 'hunter' as const,
  }));
}

/** Stub LinkedIn search respecting daily limits */
function searchLinkedIn(company: string): Promise<Lead[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ [LINKEDIN_CALLS_KEY]: 0 }, (res) => {
      const calls = res[LINKEDIN_CALLS_KEY] as number;
      if (calls >= MAX_LINKEDIN_CALLS_PER_DAY) {
        resolve([]);
        return;
      }
      chrome.storage.local.set({ [LINKEDIN_CALLS_KEY]: calls + 1 }, () => {
        resolve([
          {
            name: `LinkedIn Recruiter at ${company}`,
            email: 'recruiter@example.com',
            title: 'Recruiter',
            source: 'linkedin' as const,
          },
        ]);
      });
    });
  });
}

export async function findLeads(
  company: string,
  onPage: Lead[] = [],
): Promise<Lead[]> {
  const leads = onPage.filter((l) => l.email);
  if (leads.length) return leads.slice(0, 3);
  const hunter = await fetchHunterLeads(company);
  if (hunter.length) return hunter.slice(0, 3);
  return searchLinkedIn(company);
}
