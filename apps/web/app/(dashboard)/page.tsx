"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex   min-h-svh">
        <p>Authenticated</p>
        <UserButton />
        <OrganizationSwitcher hidePersonal />
      </div>
    </>
  );
}
