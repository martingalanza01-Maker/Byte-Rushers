// components/google-login-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import type { GoogleUser } from "@/lib/google-auth";

type GoogleLoginButtonProps = {
  onSuccess?: (user: GoogleUser) => void; // kept for future wiring
  onError?: (error: string) => void;      // kept for future wiring
  disabled?: boolean;
};

export function GoogleLoginButton({ onSuccess, onError, disabled }: GoogleLoginButtonProps) {
  const handleClick = () => {
    // Placeholder: Google sign-in will be configured later
    if (onError) onError("Google sign-in will be configured later.");
    else alert("Google sign-in will be configured later.");
  };

  return (
    <Button type="button" className="w-full" onClick={handleClick} disabled={disabled}>
      <Chrome className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
