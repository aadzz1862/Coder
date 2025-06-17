import {
  getDraftSettings,
  saveDraftSettings,
} from '../extension/src/lib/settings';

declare const global: any;

beforeEach(() => {
  global.chrome = {
    storage: {
      local: {
        get: jest.fn((defaults, cb) =>
          cb({ engine: 'huggingface', hfApiKey: 'k' }),
        ),
        set: jest.fn((val, cb) => cb()),
      },
    },
    runtime: {},
  };
});

test('getDraftSettings returns stored values', async () => {
  const s = await getDraftSettings();
  expect(s.engine).toBe('huggingface');
  expect(s.hfApiKey).toBe('k');
});

test('saveDraftSettings writes to chrome storage', async () => {
  await saveDraftSettings({ engine: 'rule', hfApiKey: '' });
  expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
    { engine: 'rule', hfApiKey: '' },
    expect.any(Function),
  );
});
