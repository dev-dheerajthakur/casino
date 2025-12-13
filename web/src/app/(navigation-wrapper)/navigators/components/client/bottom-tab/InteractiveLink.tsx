"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface props {
  children: React.ReactNode;
  href: string;
  style?: React.CSSProperties;
  classname?: string;
}

export default function InteractiveLink({
  children,
  href,
  style,
  classname,
}: props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      style={pathname === href ? { color: "green", ...style } : style}
      className={classname}
    >
      {children}
    </Link>
  );
}
