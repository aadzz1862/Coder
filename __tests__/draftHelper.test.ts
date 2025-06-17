import 'isomorphic-fetch';
import { draftWithHF, draftWithRule } from '../extension/src/lib/draft';

declare const global: any;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ choices: [{ text: 'Draft text' }] }),
    }),
  );
});

test('draftWithHF calls huggingface API', async () => {
  const text = await draftWithHF('ACME', 'key');
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api-inference.huggingface.co/v1/completions',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer key' }),
    }),
  );
  expect(text).toBe('Draft text');
});

test('draftWithRule returns canned text', () => {
  const text = draftWithRule('ACME');
  expect(text).toContain('ACME');
});
