import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gradient-to-br from-background via-muted to-background px-6">
      <div className="animate-spin mb-6">
        <Loader2 className="h-14 w-14 text-primary" />
      </div>
      <p className="text-lg font-medium text-muted-foreground text-center">
        <span className="animate-pulse">Preparing something awesome...</span>
      </p>
    </div>
  );
}
