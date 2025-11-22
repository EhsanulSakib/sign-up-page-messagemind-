import BottomLinks from "@/components/BottomLinks";
import SignUpField from "@/components/SignUpField";
import SocialLogin from "@/components/SocialLogin";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-screen justify-between w-full">
      <section className="my-16 w-full flex flex-col min-h-[85vh] justify-between items-center">
        <section className="w-full max-w-[420px] px-4 lg:px-0 space-y-6">
          <div className="mb-10 flex flex-col items-center">
            <h1 className="text-2xl font-semibold leading-tight">
              Fresha for professionals
            </h1>
            <p className="font-light text-[15px] leading-tight mt-1 text-white/70 text-center">
              Create an account or log in to manage your business.
            </p>
          </div>

          <div>
            <SignUpField />
          </div>

          <div className="flex justify-center items-center">
            <div className="w-full bg-gray-700 h-px " />
            <p className="w-20 text-center text-gray-400 text-sm">OR</p>
            <div className="w-full bg-gray-700 h-px " />
          </div>

          <div>
            <SocialLogin />
          </div>

          <div className="w-full bg-gray-700 h-px " />

          <div className="flex flex-col items-center text-center">
            <p>Are you a customer looking to book an appointment?</p>
            <Link
              href="#"
              className="text-text-primary cursor-pointer hover:text-[#B0B1FD]"
            >
              Go to Fresha for customers
            </Link>
          </div>
        </section>

        <section className="text-center text-sm">
          <p className=" text-white/70">This site is protected by reCAPTCHA</p>
          <p className="text-white/70">Google <Link href="#" className="hover:underline">Privacy Policy</Link> and <Link href="#" className="hover:underline">Terms of Service</Link> apply</p>

          <div>
            <BottomLinks/>
          </div>
        </section>
      </section>

      <section className="hidden lg:block lg:w-full h-screen sticky top-0">
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
}
