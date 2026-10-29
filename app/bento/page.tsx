"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HowIWorkSection from "@/components/sections/how-i-work";

function BentoContent() {
  const searchParams = useSearchParams();
  const tStr = searchParams.get("t");
  const testProgress = tStr !== null ? parseFloat(tStr) : undefined;

  return (
    <main className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4">
      <div className="w-full">
        <HowIWorkSection testProgress={testProgress} />
      </div>
    </main>
  );
}

export default function BentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709]" />}>
      <BentoContent />
    </Suspense>
  );
}
