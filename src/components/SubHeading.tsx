"use client";

import { useAppSelector } from "@/redux/hooks";

const SubHeading = () => {
  const email = useAppSelector((state) => state.auth.email);

  console.log(email)

  return (
    <p className="font-light text-[15px] leading-tight mt-1 text-white/80 text-center">
      You&apos;re almost there! Create your new account for{" "}
      <span className="font-semibold">{email}</span> by completing these
      details.
    </p>
  );
};

export default SubHeading;
