import 'isomorphic-fetch';
import { sendEmail } from '../extension/src/lib/gmail';

declare const global: any;

beforeEach(() => {
  global.chrome = {
    identity: {
      getAuthToken: jest.fn((_, cb) => cb('token')),
    },
    runtime: {},
  };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 'msg123' }),
    }),
  );
});

describe('sendEmail', () => {
  it('posts formatted message and returns id', async () => {
    const id = await sendEmail('to@example.com', 'Hello', '<p>Body</p>');
    const raw =
      `To: to@example.com\r\n` +
      `Subject: Hello\r\n` +
      'Content-Type: text/html; charset="UTF-8"\r\n' +
      'MIME-Version: 1.0\r\n\r\n' +
      '<p>Body</p>';
    const encoded = btoa(unescape(encodeURIComponent(raw)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encoded }),
      },
    );
    expect(id).toBe('msg123');
  });
});
