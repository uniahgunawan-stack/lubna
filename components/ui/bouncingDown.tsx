"use client";

import { ArrowDown } from "lucide-react";

export function Bouncing() {
  return (
    <div className="mt-8 flex justify-center gap-6">
      <ArrowDown className="h-10 w-10 -rotate-45 animate-bounce text-red-500" />

      <ArrowDown className="h-12 w-12 animate-bounce text-red-500" />

      <ArrowDown className="h-10 w-10 rotate-45 animate-bounce text-red-500" />
    </div>
  );
}
