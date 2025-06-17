import {
  findLeads,
  MAX_LINKEDIN_CALLS_PER_DAY,
} from '../extension/src/lib/leadFinder';

declare const global: any;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { emails: [] } }),
    }),
  );
  global.chrome = {
    storage: {
      local: {
        get: jest.fn((defaults, cb) => cb({ linkedinCallsToday: 0 })),
        set: jest.fn((val, cb) => cb()),
      },
    },
    runtime: {},
  };
});

test('uses linkedin stub when hunter returns no leads', async () => {
  const leads = await findLeads('ExampleCo');
  expect(global.fetch).toHaveBeenCalled();
  expect(leads[0].source).toBe('linkedin');
  expect(leads[0].email).toBe('recruiter@example.com');
});

test('limits linkedin calls by MAX_LINKEDIN_CALLS_PER_DAY', async () => {
  global.chrome.storage.local.get = jest.fn((_, cb) =>
    cb({ linkedinCallsToday: MAX_LINKEDIN_CALLS_PER_DAY }),
  );
  const leads = await findLeads('Example');
  expect(leads.length).toBe(0);
});
