import { getGmailToken } from '../extension/src/GmailOAuth';

declare const global: any;

beforeAll(() => {
  global.chrome = {
    identity: {
      getAuthToken: jest.fn((_, cb) => cb('token')),
    },
    runtime: {},
  };
});

describe('getGmailToken', () => {
  it('should resolve with token', async () => {
    await expect(getGmailToken()).resolves.toBe('token');
  });
});
