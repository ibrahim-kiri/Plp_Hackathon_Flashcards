'use client';

import { SignIn, useUser } from '@clerk/nextjs';

export default function SignInPage() {
  // const { user } = useUser();

  return (
    <div className="grid place-items-center h-screen bg-black">
      <SignIn signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}
