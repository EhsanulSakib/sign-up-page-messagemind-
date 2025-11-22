import Image from "next/image";
import Link from "next/link";
import React from "react";

const socials = [
  {
    text: "Continue with Facebook",
    image: "/socials/facebook.svg",
    link: "#"
  },
  {
    text: "Continue with Google",
    image: "/socials/google.svg",
    link: "#"
  },

  {
    text: "Continue with Apple",
    image: "/socials/apple.svg",
    link: "#"
  }
];

const SocialLogin = () => {
  return <section className="space-y-4">
    {
      socials.map((social, index) => {
        return (
          <Link href={social.link} key={index} className="flex items-center justify-center gap-2 border border-gray-700 px-4 py-2 rounded-full hover:bg-white/5">
            <Image width={44} height={44} src={social.image} alt={social.text} className="h-6 w-6" />
            <p className="w-full text-center text-[17px] font-semibold leading-relaxed pr-8">{social.text}</p>
          </Link>
        )
      })
    }
  </section>;
};

export default SocialLogin;
