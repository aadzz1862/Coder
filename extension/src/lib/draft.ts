export type DraftEngine = 'rule' | 'huggingface';

export interface HFCompletionResponse {
  choices: Array<{ text: string }>;
}

/** Generate email draft using Hugging Face inference API */
export async function draftWithHF(
  company: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch(
    'https://api-inference.huggingface.co/v1/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        prompt: `Write a short referral request email for a job at ${company}.`,
        max_tokens: 128,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`HF error ${res.status}`);
  }
  const data = (await res.json()) as HFCompletionResponse;
  const text = data.choices?.[0]?.text?.trim();
  if (!text) throw new Error('No completion text');
  return text;
}

/** Simple rule-based fallback draft */
export function draftWithRule(company: string): string {
  return `Hello,\n\nI recently applied to ${company} and would appreciate a referral if possible.\n\nBest regards,\nYour Name`;
}
