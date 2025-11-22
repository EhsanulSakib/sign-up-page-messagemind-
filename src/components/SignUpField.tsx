"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setEmail } from "@/redux/slices/authSlice";

type FormValues = {
  email: string;
};

export default function SignUpField() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const savedEmail = useAppSelector((state) => state.auth.email);

  const form = useForm<FormValues>({
    defaultValues: { email: savedEmail || "" }, // ✅ Initialize from Redux
    mode: "onSubmit",
  });

  const { watch, reset, trigger, handleSubmit } = form;

  // ✅ Keep input synced if Redux email changes
  useEffect(() => {
    reset({ email: savedEmail || "" });
  }, [savedEmail, reset]);

  const emailTypedValue = watch("email");
  const [hasBlurredOnce, setHasBlurredOnce] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    if (emailTypedValue.length > 0) setHasTyped(true);
  }, [emailTypedValue]);

  const shouldWatch = hasTyped && hasBlurredOnce;

  useEffect(() => {
    if (shouldWatch) trigger("email");
  }, [emailTypedValue, shouldWatch, trigger]);

  const onSubmit = (data: FormValues) => {
    dispatch(setEmail(data.email)); // Save to Redux
    router.push("/sign-up");
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "This field is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email format invalid",
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <Input
                  {...field}
                  className={`
                    dark-input
                    rounded-md px-4 py-6 outline-none transition-all
                    ${
                      fieldState.error
                        ? "border-red-600"
                        : "border-gray-700 hover:border-gray-400"
                    }
                    focus:border-purple-400
                    focus:ring-1
                  `}
                  placeholder="Enter your email address"
                  type="email"
                  onBlur={() => {
                    field.onBlur();
                    if (hasTyped) {
                      setHasBlurredOnce(true);
                      trigger("email");
                    }
                  }}
                />
              </FormControl>

              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="w-full bg-white cursor-pointer hover:bg-white/90 transition duration-150 text-black py-3 px-4 rounded-full font-medium"
        >
          Continue
        </button>
      </form>
    </Form>
  );
}
