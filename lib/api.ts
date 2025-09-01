const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

export type SubmissionInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  category?: string;
  message: string;
  urgent?: boolean;
};

export async function createSubmission(input: SubmissionInput) {
  const res = await fetch(`${baseURL}/submissions`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function listSubmissions() {
  const res = await fetch(`${baseURL}/submissions`, {cache: 'no-store'});
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}
