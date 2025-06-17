/**
 * Gmail API helper functions.
 * @see https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send
 */

export interface GmailSendResponse {
  /** ID of the sent message */
  id: string;
  /** Thread ID */
  threadId?: string;
  /** Labels applied to the message */
  labelIds?: string[];
}

export interface GmailErrorResponse {
  error: {
    message: string;
    code: number;
    status?: string;
    errors?: Array<{ message: string; domain: string; reason: string }>;
  };
}

/**
 * Send an email using the Gmail API.
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param htmlBody - HTML body of the email
 * @returns The ID of the created Gmail message
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<string> {
  const token = await new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (t) => {
      if (chrome.runtime.lastError || !t) {
        reject(
          new Error(
            chrome.runtime.lastError?.message || 'Failed to acquire token',
          ),
        );
        return;
      }
      resolve(t);
    });
  });

  const rawMessage =
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    'Content-Type: text/html; charset="UTF-8"\r\n' +
    'MIME-Version: 1.0\r\n\r\n' +
    htmlBody;

  const encoded = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    },
  );

  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const err = (data as GmailErrorResponse).error;
    throw new Error(
      `Gmail API error ${res.status}: ${err?.message || res.statusText}`,
    );
  }

  return (data as GmailSendResponse).id;
}
