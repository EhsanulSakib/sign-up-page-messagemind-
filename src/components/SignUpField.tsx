"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setEmail } from "@/redux/slices/authSlice";

type FormValues = {
  email: string;
};

const inputs = [
  "@gmail.com",
  "@hotmail.com",
  "@yahoo.com",
  "@outlook.com",
  "@icloud.com"
];

export default function SignUpField() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const savedEmail = useAppSelector((state) => state.auth.email);

  const form = useForm<FormValues>({
    defaultValues: { email: savedEmail || "" },
    mode: "onSubmit",           // ← already correct
    reValidateMode: "onSubmit"  // ← ensure no re-validation on change
  });

  const { reset, handleSubmit } = form;

  // Keep input synced if Redux email changes
  useEffect(() => {
    reset({ email: savedEmail || "" });
  }, [savedEmail, reset]);

  const onSubmit = (data: FormValues) => {
    dispatch(setEmail(data.email));
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
              message: "Email format invalid"
            }
          }}
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <Input
                  {...field}
                  // Clear error as soon as user types again
                  onChange={(e) => {
                    field.onChange(e);
                    if (fieldState.error) {
                      form.clearErrors("email");
                    }
                  }}
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
                />
              </FormControl>

              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <div
          className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            const container = e.currentTarget;
            const startX = e.pageX - container.offsetLeft;
            const scrollLeft = container.scrollLeft;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const x = moveEvent.pageX - container.offsetLeft;
              const walk = (x - startX) * 1.5;
              container.scrollLeft = scrollLeft - walk;
            };

            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
        >
          {inputs.map((input, index) => (
            <p
              key={index}
              onClick={() => {
                const current = form.getValues("email") || "";
                if (current.includes("@")) {
                  const prefix = current.split("@")[0];
                  form.setValue("email", prefix + input, {
                    shouldValidate: false
                  });
                } else {
                  form.setValue("email", current + input, {
                    shouldValidate: false
                  });
                }
                // Clear any existing error when user picks a domain
                form.clearErrors("email");
              }}
              className="px-2 py-1 border border-white rounded-full text-white text-sm whitespace-nowrap select-none"
            >
              {input}
            </p>
          ))}
        </div>

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