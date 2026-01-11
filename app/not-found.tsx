import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-background to-muted">
      <div className="bg-white dark:bg-[#1a1a1a] shadow-xl rounded-2xl p-10 text-center max-w-md w-full border border-border">
        <div className="animate-pulse mb-6">
          <Ghost className="w-16 h-16 text-destructive mx-auto" />
        </div>
        <h1 className="text-5xl font-extrabold text-destructive mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">← Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
