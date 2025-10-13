"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import React, { useEffect } from "react";
import { checkAndAddUser } from "../actions";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    {
      href: "/",
      label: "Factures",
    },
    
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user.fullName);
    }
  }, [user]);

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => {
      return (
        <Link
          href={href}
          key={href}
          className={`btn-sm  ${classNames} ${
            isActiveLink(href) ? "btn-accent" : ""
          }`}
        >
          {label}
        </Link>
      );
    });

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-accent-content text-accent  rounded-full p-2">
            <Layers className="h-6 w-6" />
          </div>
          <span className="ml-3 font-bold text-2xl italic z-50">
            Kis@rr<span className="text-orange-500">Web</span>
          </span>
          <Image
            src="/taureau1.png"
            width={56}
            height={56}
            alt="Logo Kis@rrw3b"
            className="ml-[-10] z-0 rounded-3xl"
          />
        </div>

        <div className="flex  space-x-4 items-center">
          {renderLinks("btn")}
          <UserButton />
          <div>
            {user?.fullName && user.emailAddresses[0].emailAddress }
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Navbar;
