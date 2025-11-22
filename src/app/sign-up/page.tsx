import BackButton from "@/components/BackButton";
import BottomLinks from "@/components/BottomLinks";
import RegisterForm from "@/components/RegisterForm";
import SubHeading from "@/components/SubHeading";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <section className="flex min-h-screen justify-between w-full">
      <section className="relative my-16 w-full flex flex-col min-h-[80vh] justify-between items-center">
        <BackButton />
        <section className="w-full max-w-[420px] px-4 lg:px-0 space-y-6">
          <div className="mb-10 flex flex-col items-center">
            <h1 className="text-2xl font-semibold leading-tight">
              Create a professional account
            </h1>
            <SubHeading />
          </div>

          <div>
            <RegisterForm />
          </div>
        </section>

        <section className="text-center text-sm mt-12 lg:mt-16">
          <p className=" text-white/70">This site is protected by reCAPTCHA</p>
          <p className="text-white/70">
            Google{" "}
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>{" "}
            apply
          </p>

          <div>
            <BottomLinks />
          </div>
        </section>
      </section>

      <section className="hidden lg:block lg:w-full h-screen sticky top-0 ">
        <Image
          src="/banner-image.jpg"
          alt="banner"
          width={900}
          height={900}
          className="h-screen w-full object-cover object-right"
        />
      </section>
    </section>
  );
};

export default page;
