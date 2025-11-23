"use client";
import { useEffect, useRef, useState } from "react";
import { FieldError } from "react-hook-form";

export default function CountryCodeSelect({
  value,
  error,
  onChange,
  countries
}: {
  value: string | undefined;
  error: FieldError | undefined;
  onChange: (value: string) => void;
  countries: { phoneCode: string; name: string; countryCode: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="w-24" ref={ref}>
      {/* SELECTED TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full rounded-md border ${
          error ? "border-red-600" : "border-gray-700 hover:border-gray-400"
        } dark:bg-[#1F1F1F] px-3 py-3 text-left flex items-center justify-between cursor-pointer`}
      >
        {/* Only show phoneCode */}
        <span>{value || "+00"}</span>

        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* DROPDOWN OPTIONS */}
      {open && (
        <div className="absolute z-20 lg:w-full max-w-[420px] mt-2 max-h-72 overflow-auto rounded-md border border-gray-700 dark:bg-[#1F1F1F] shadow-lg custom-scroll">
          {countries.map((c) => (
            <div
              key={c.countryCode}
              className="px-3 py-2 cursor-pointer hover:bg-gray-800 flex gap-2 items-end"
              onClick={() => {
                onChange(c.phoneCode);
                setOpen(false);
              }}
            >
              <span className="text-sm">{c.name.split(" (")[0]}</span>
              <span className="text-[9px] mb-0.5 font-semibold">
                {c.countryCode}
              </span>
              <span className="text-sm">{c.phoneCode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
