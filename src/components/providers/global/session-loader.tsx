"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SessionLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, sessionId } = useAuth(); // isLoaded = session fetch done, sessionId = current session
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!sessionId) {
        // No session found, redirect to sign-in
        router.replace("/sign-in");
      } else {
        // Session exists, stop loading
        setLoading(false);
      }
    }
  }, [isLoaded, sessionId, router]);

  if (loading) {
    return (
      <div className="flex items-center w-full justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionLoader;
