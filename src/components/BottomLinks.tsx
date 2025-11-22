import Link from "next/link";
import React from "react";

const links = [
  {
    icon: (
      <path
        fillRule="evenodd"
        d="M19.429 3.457C24.944 4.96 29 10.007 29 16c0 2.022-.462 3.937-1.285 5.643a1 1 0 0 1-.088.18l-.006.01c-2.084 4.144-6.319 7.02-11.238 7.161a1 1 0 0 1-.169.004L16 29C8.82 29 3 23.18 3 16S8.82 3 16 3c1.105 0 2.177.138 3.201.397q.117.017.227.06M5 16c0-1.786.426-3.473 1.181-4.965l1.305 3.471a1.99 1.99 0 0 0 1.454 1.272l2.675.574.471.981.009.018a2.03 2.03 0 0 0 1.778 1.111h.163l-.96 2.154a2 2 0 0 0 .35 2.173l2.352 2.544-.322 1.654C9.633 26.703 5 21.893 5 16"
        clipRule="evenodd"
      />
    ),
    name: "English",
    href: "#"
  },
  {
    icon: (
      <path
        fillRule="evenodd"
        d="M7.547 8.961A10.96 10.96 0 0 0 5 16c0 2.677.957 5.131 2.547 7.039l3.562-3.562A5.97 5.97 0 0 1 10 16c0-1.296.41-2.496 1.11-3.476zm-.798-2.094A12.96 12.96 0 0 0 3 16c0 3.56 1.43 6.785 3.749 9.133a1 1 0 0 0 .118.118A12.96 12.96 0 0 0 16 29c3.56 0 6.785-1.43 9.133-3.748a1 1 0 0 0 .119-.12A12.96 12.96 0 0 0 29 16c0-3.56-1.43-6.785-3.748-9.133a1 1 0 0 0-.119-.118A12.96 12.96 0 0 0 16 3c-3.56 0-6.786 1.43-9.133 3.749a1 1 0 0 0-.118.118m2.212.68 3.562 3.562A5.97 5.97 0 0 1 16 10c1.296 0 2.496.41 3.477 1.11l3.562-3.563A10.96 10.96 0 0 0 16 5c-2.677 0-5.132.957-7.04 2.547M24.453 8.96l-3.562 3.563C21.589 13.504 22 14.704 22 16s-.41 2.496-1.11 3.477l3.563 3.562A10.96 10.96 0 0 0 27 16c0-2.677-.957-5.132-2.547-7.039"
        clipRule="evenodd"
      />
    ),
    name: "Support",
    href: "https://www.fresha.com/help-center"
  },
  {
    name: "Privacy Policy",
    href: "https://terms.fresha.com/privacy-policy"
  }
];

const BottomLinks = () => {
  return (
    <div className="flex gap-2 items-center justify-center mt-6">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Link
            target="_blank"
            href={link.href}
            className="text-[15px] flex items-center gap-1 text-text-primary hover:text-text-primary-hover"
          >
            {link.icon && (
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-5 h-5"
              >
                {link.icon}
              </svg>
            )}
            {link.name}
          </Link>

          {index < links.length - 1 && (
            <span className="w-1 h-1 rounded-full bg-text-primary" />
          )}
        </div>
      ))}
    </div>
  );
};

export default BottomLinks;
