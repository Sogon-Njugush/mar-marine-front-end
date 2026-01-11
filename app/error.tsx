"use client"; // This is required

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("App crashed with error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-background to-muted">
      <div className="bg-white dark:bg-[#1a1a1a] shadow-xl rounded-2xl p-10 text-center max-w-md w-full border border-border">
        <div className="animate-bounce mb-6">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, an unexpected error has occurred.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/">← Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
