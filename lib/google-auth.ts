// lib/google-auth.ts
// Minimal typings & stubs; real Google OAuth can be wired later.

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  user?: GoogleUser;
  error?: string;
}

export async function mockGoogleSignIn(): Promise<GoogleAuthResponse> {
  return { success: false, error: 'Google sign-in not configured' };
}

export function isGoogleConfigured(): boolean {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return !!clientId && clientId !== 'your-google-client-id-here';
}
