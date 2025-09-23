"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { redirect } from "next/navigation";

function Header() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isSignedIn && isLoaded === true) {
      redirect(`/login`);
    }
  }, [isSignedIn, isLoaded]);

  return (
    <header className=" shadow-sm text-gray-800 flex justify-between p-5">
      <Link href="/" className="flex items-center text-4xl font-thin">
        <Avatar seed="PAPAFAM Support Agent" />
        <div className="space-y-1 text-sm">
          <h1>Assistly</h1>
          <h2 className="text-sm">Your Customizable AI Chat Agent</h2>
        </div>
      </Link>

      <div className="flex items-center">
        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
export default Header;
