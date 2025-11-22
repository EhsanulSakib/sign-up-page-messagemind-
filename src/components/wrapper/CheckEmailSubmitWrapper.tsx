"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CheckEmailSubmitWrapper = ({ children }: { children: React.ReactNode }) => {
  const email = useAppSelector((state) => state.auth.email);
  const router = useRouter();

  useEffect(() => {
    if (email === null) {
      router.replace("/"); // <-- better than push here
    }
  }, [email, router]);

  if (email === null) return null; // prevents UI flash

  return <section>{children}</section>;
};

export default CheckEmailSubmitWrapper;
