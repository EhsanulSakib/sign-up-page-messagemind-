"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { countries } from "country-data";
import parsePhoneNumber from "libphonenumber-js";
import * as ct from "countries-and-timezones";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import CountryCodeSelect from "./CountryCodeSelect";
import { useAppDispatch } from "@/redux/hooks";
import { resetAuthState } from "@/redux/slices/authSlice";

type IpInfoResponse = { country?: string };

type FormValues = {
  firstName: string;
  lastName?: string;
  password: string;
  countryCode?: string;
  phone: string;
  country: string;
  timezone: string;
  language: string;
  agree: boolean;
};

const languages = [
  {
    country: "US",
    lang: "English"
  },
  {
    country: "BD",
    lang: "বাংলা"
  },
  {
    country: "IN",
    lang: "हिन्दी"
  },
  {
    country: "PK",
    lang: "اردو"
  },
  {
    country: "FR",
    lang: "Français"
  },
  {
    country: "DE",
    lang: "Deutsch"
  },
  {
    country: "ES",
    lang: "Español"
  },
  {
    country: "CN",
    lang: "中文"
  },
  {
    country: "JP",
    lang: "日本語"
  },
  {
    country: "RU",
    lang: "Русский"
  },
  {
    country: "SA",
    lang: "العربية"
  }
];

export default function RegisterForm() {
  const [countriesList, setCountriesList] = useState<
    { name: string; countryCode: string; phoneCode: string }[]
  >([]);
  const [countryEditable, setCountryEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [manualCountryChange, setManualCountryChange] = useState(false);

  const [allTimezones, setAllTimezones] = useState<ct.Timezone[]>([]);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onChange", // <-- important for live password rules
    defaultValues: { agree: true } // optional – you had defaultChecked
  });

  // Load countries on mount
  useEffect(() => {
    const list = countries.all
      .filter((c) => c.countryCallingCodes.length > 0)
      .map((c) => ({
        name: c.name,
        countryCode: c.alpha2,
        phoneCode: c.countryCallingCodes[0]
      }));

    setCountriesList(list);
  }, []);

  // Auto-detect user country on mount
  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data: IpInfoResponse = await res.json();

        if (data?.country) {
          const iso2 = data.country.toUpperCase();
          const matched = countries.all.find((c) => c.alpha2 === iso2);

          if (matched && matched.countryCallingCodes.length > 0) {
            const phoneCode = matched.countryCallingCodes[0];
            const countryCode = matched.alpha2;

            setValue("country", countryCode);
            setValue("countryCode", phoneCode);
            trigger("countryCode"); // Update UI
          }
        }
      } catch (e) {
        console.log("IP Fetch Error:", e);
      }
    }

    if (!watch("countryCode")) {
      detectCountry();
    }
  }, [setValue, watch, trigger]);

  console.log(
    "countryCode:",
    watch("countryCode"),
    "phone:",
    watch("phone"),
    "country:",
    watch("country")
  );

  useEffect(() => {
    const tzObject = ct.getAllTimezones(); // returns object
    const tzArray = Object.values(tzObject); // convert to array
    setAllTimezones(tzArray);
  }, []);

  // Auto-update timezone when country changes
  useEffect(() => {
    const selectedCountry = watch("country");

    if (!selectedCountry) return;

    const countryTZList = ct.getTimezonesForCountry(selectedCountry);

    if (countryTZList && countryTZList.length > 0) {
      // If timezone already selected & still valid, don't overwrite
      const currentTz = watch("timezone");
      const stillValid = countryTZList.some((tz) => tz.name === currentTz);

      if (!stillValid) {
        setValue("timezone", countryTZList[0].name); // Set first timezone
      }
    }
  }, [watch("country")]);

  // Watch phone input and auto-detect country from typed number
  const phoneInput = watch("phone");
  // const selectedCountryCode = watch("countryCode");

  // Watch phone input and auto-detect country from typed number
  useEffect(() => {
    if (!phoneInput || !watch("countryCode")) return;

    const input = phoneInput.trim();
    const clean = input.replace(/[^\d+]/g, "");

    // Only process if it starts with +
    if (!clean.startsWith("+")) return;

    const currentCountryCode = watch("countryCode") as string; // e.g. "+880"

    // Always check if the input starts with the CURRENTLY selected country code
    if (clean.startsWith(currentCountryCode)) {
      const nationalNumber = clean.slice(currentCountryCode.length);

      // Only update if we're actually stripping something (avoid infinite loop)
      if (nationalNumber !== phoneInput && nationalNumber !== clean) {
        setValue("phone", nationalNumber, { shouldValidate: true });
        trigger("phone");
        return; // early exit – we handled it
      }
    }

    // Optional: Also detect other countries (fallback for when user types different code)
    let matchedCountry = null;
    for (const c of countriesList) {
      if (clean.startsWith(c.phoneCode)) {
        if (
          !matchedCountry ||
          c.phoneCode.length > matchedCountry.phoneCode.length
        ) {
          matchedCountry = c;
        }
      }
    }

    if (matchedCountry && matchedCountry.phoneCode !== currentCountryCode) {
      const code = matchedCountry.phoneCode;
      const nationalNumber = clean.slice(code.length);

      setValue("countryCode", code);
      setValue("country", matchedCountry.countryCode);
      setValue("phone", nationalNumber, { shouldValidate: true });

      // Update timezone
      const tzList = ct.getTimezonesForCountry(matchedCountry.countryCode);
      if (tzList?.length) {
        const currentTz = watch("timezone");
        const stillValid = tzList.some((tz) => tz.name === currentTz);
        if (!stillValid) {
          setValue("timezone", tzList[0].name);
        }
      }

      trigger("phone");
    }
  }, [phoneInput, countriesList, setValue, trigger, watch]);

  const onSubmit = async (data: FormValues) => {
    const fullPhone = `${data.countryCode}${data.phone}`.trim();

    console.log("Form submitted:", {
      ...data,
      fullPhone,
      isValid: parsePhoneNumber(fullPhone)?.isValid()
    });

    // 🎉 Show success toast
    toast.success("Account created successfully!");

    // 🧹 Clear Redux state
    dispatch(resetAuthState());

    // 🧽 Reset the entire form smoothly
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* FIRST NAME */}
      <div>
        <Label className="mb-2 font-bold ">First name</Label>
        <Input
          className={`
            dark-input
            rounded-md px-4 py-6 outline-none transition-all
            ${
              errors.firstName
                ? "border-red-600"
                : "border-gray-700 hover:border-gray-400"
            }
            focus:ring-0
          `}
          placeholder="Enter your first name"
          {...register("firstName", { required: "This field is required" })}
        />
        {errors.firstName && (
          <p className="text-red-500 text-[13px]">{errors.firstName.message}</p>
        )}
      </div>

      {/* LAST NAME */}
      <div>
        <Label className="mb-2 font-bold ">Last name</Label>
        <Input
          className={`
            dark-input
            rounded-md px-4 py-6 outline-none transition-all
            border-gray-700 hover:border-gray-400
            focus:ring-0
          `}
          placeholder="Enter your last name"
          {...register("lastName")}
        />
        {/* {errors.lastName && (
          <p className="text-red-500 text-[13px]">{errors.lastName.message}</p>
        )} */}
      </div>

      <div>
        <Label className="mb-2 font-bold ">Password</Label>

        {/* Password Input */}
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter a password"
            className={`
              dark-input
              rounded-md px-4 py-6 outline-none transition-all
            ${
              errors.password
                ? "border-red-600"
                : "border-gray-700 hover:border-gray-400"
            }
              focus:ring-0
            `}
            {...register("password", {
              required: "Password is required",
              validate: {
                minLength: (value) =>
                  value.length >= 8 || "At least 8 characters required",
                hasNumber: (value) =>
                  /\d/.test(value) || "Must contain at least 1 number",
                hasLetter: (value) =>
                  /[A-Za-z]/.test(value) || "Must contain at least 1 letter"
              }
            })}
          />
          <button
            className="absolute right-3 top-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye size={16} className="h-4 w-4 text-white/80" />
            ) : (
              <EyeOff size={16} className="h-4 w-4 text-white/80" />
            )}
          </button>
        </div>

        {/* LIVE PASSWORD RULE UI */}
        {(watch("password") || errors.password) && (
          <div className="mt-2 space-y-1">
            {/* Rule 1 */}
            <div className="flex items-center gap-2">
              {watch("password").length >= 8 ? (
                <span className="text-green-500 text-sm">✔</span>
              ) : (
                <span className="text-red-500 text-sm">✖</span>
              )}
              <p
                className={`text-sm ${
                  watch("password").length >= 8
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                At least 8 characters
              </p>
            </div>

            {/* Rule 2 */}
            <div className="flex items-center gap-2">
              {/\d/.test(watch("password")) ? (
                <span className="text-green-500 text-sm">✔</span>
              ) : (
                <span className="text-red-500 text-sm">✖</span>
              )}
              <p
                className={`text-sm ${
                  /\d/.test(watch("password"))
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Contains a number
              </p>
            </div>

            {/* Rule 3 */}
            <div className="flex items-center gap-2">
              {/[A-Za-z]/.test(watch("password")) ? (
                <span className="text-green-500 text-sm">✔</span>
              ) : (
                <span className="text-red-500 text-sm">✖</span>
              )}
              <p
                className={`text-sm ${
                  /[A-Za-z]/.test(watch("password"))
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Contains a letter
              </p>
            </div>
          </div>
        )}

        {/* RHF FINAL ERROR MESSAGE (ONLY SHOW WHEN SUBMITTED) */}
        {/* {errors.password && (
          <p className="text-red-500 text-[13px] mt-1">
            {errors.password.message}
          </p>
        )} */}
      </div>

      {/* PHONE NUMBER */}
      <div>
        <Label className="mb-2 font-bold ">Mobile number</Label>
        <div className="flex gap-3">
          <CountryCodeSelect
            value={watch("countryCode")}
            error={errors.phone}
            onChange={(value) => {
              setValue("countryCode", value);

              const country = countriesList.find((c) => c.phoneCode === value);
              if (country) setValue("country", country.countryCode);

              trigger("phone");
            }}
            countries={countriesList}
          />

          {/* National Phone Number */}
          <Input
            placeholder="Enter your mobile number"
            className={`flex-1 dark-input rounded-md px-4 py-6 ${
              errors.phone
                ? "border-red-600"
                : "border-gray-700 hover:border-gray-400"
            } focus:ring-0`}
            {...register("phone", {
              required: "Mobile number is required",
              validate: (value) => {
                if (!value.trim()) return "Mobile number is required";

                const full = `${watch("countryCode")}${value}`;
                try {
                  const phone = parsePhoneNumber(full);
                  return (
                    phone?.isValid() ||
                    "Invalid mobile number for selected country"
                  );
                } catch {
                  return "Invalid mobile number";
                }
              }
            })}
            onChange={(e) => {
              let value = e.target.value;

              // Allow only digits, + and -
              value = value.replace(/[^\d+-]/g, "");

              setValue("phone", value);
              trigger("phone");
            }}
          />
        </div>

        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* COUNTRY SELECT */}
      <div>
        <Label className="mb-2 font-bold ">Country</Label>
        <div className="relative group">
          <Select
            disabled={!countryEditable}
            value={watch("country")}
            onValueChange={(value) => {
              setManualCountryChange(true); // prevent auto sync from phone
              setValue("country", value);

              const selected = countriesList.find(
                (c) => c.countryCode === value
              );
              if (selected) {
                setValue("countryCode", selected.phoneCode);
                const tzList = ct.getTimezonesForCountry(selected.countryCode);
                if (tzList?.length) setValue("timezone", tzList[0].name);
              }
            }}
          >
            <SelectTrigger className="w-full dark-input rounded-md px-4 py-6 border-gray-700 hover:border-gray-400 disabled:opacity-100">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countriesList.map((c) => (
                <SelectItem key={c.countryCode} value={c.countryCode}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!countryEditable && watch("country") && (
            <button
              type="button"
              onClick={() => setCountryEditable(true)}
              className="absolute right-3 top-4 h-fit w-fit bg-[#1f1f1f] group-hover:bg-[#262626] hover:bg-[#1f1f1f] text-text-primary hover:text-text-primary-hover text-xs cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {countryEditable && (
        <section className="space-y-4">
          {/* TIMEZONE DROPDOWN */}
          <div>
            <Label className="mb-2 font-bold ">Time zone</Label>

            <Select
              value={watch("timezone")}
              onValueChange={(v) => setValue("timezone", v)}
            >
              <SelectTrigger className="w-full dark-input rounded-md px-4 py-6 border-gray-700 hover:border-gray-400">
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>

              <SelectContent>
                {allTimezones.map((tz) => (
                  <SelectItem key={tz.name} value={tz.name}>
                    {tz.name} (UTC {tz.utcOffsetStr})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.timezone && (
              <p className="text-red-500 text-[13px]">
                {errors.timezone.message}
              </p>
            )}
          </div>

          {/* LANGUAGE DROPDOWN */}
          <div>
            <Label className="mb-2 font-bold ">Language</Label>

            <Select
              value={watch("language")}
              defaultValue="English"
              onValueChange={(value) => setValue("language", value)}
            >
              <SelectTrigger className="w-full dark-input rounded-md px-4 py-6 border-gray-700 hover:border-gray-400">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>

              <SelectContent className="max-h-64">
                {languages.map((l) => (
                  <SelectItem key={l.country} value={l.lang}>
                    <span className="text-[9px] mt-1">{l.country}</span>{" "}
                    {l.lang} ({l.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.language && (
              <p className="text-red-500 text-[13px]">
                {errors.language.message}
              </p>
            )}
          </div>
        </section>
      )}

      {/* AGREEMENT */}
      <div className="flex gap-3 items-start">
        <Checkbox
          defaultChecked
          className={`mt-1.5 scale-[1.3]
    border-[#8880ff] 
    text-[#8880FF] 
    data-[state=checked]:bg-[#8880FF] 
    data-[state=checked]:border-[#8880FF]
    transition-all duration-300 
    data-[state=checked]:scale-[1.3]
    hover:scale-150
  `}
          {...register("agree", { required: true })}
        />

        <p>
          I agree to the{" "}
          <Link
            href="#"
            className="text-text-primary hover:text-text-primary-hover"
          >
            Privacy Policy
          </Link>
          ,{" "}
          <Link
            href="#"
            className="text-text-primary hover:text-text-primary-hover"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-text-primary hover:text-text-primary-hover"
          >
            Terms of Business
          </Link>
          .
        </p>
      </div>
      {errors.agree && (
        <p className="text-red-500 text-[13px]">Policies must be accepted</p>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full bg-white cursor-pointer hover:bg-white/90 transition duration-150 text-black py-3 px-4 rounded-full font-medium"
      >
        Create account
      </button>
    </form>
  );
}
