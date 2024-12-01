'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="grid place-items-center h-screen bg-black">
      <SignUp signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
}
