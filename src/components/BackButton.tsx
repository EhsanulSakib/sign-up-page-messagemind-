'use client';
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button className="w-full absolute -top-8 left-5 cursor-pointer" onClick={() => router.back()}>
      <ArrowLeft size={12} className="h-6 w-6 text-white/80" />
    </button>
  );
};

export default BackButton;
