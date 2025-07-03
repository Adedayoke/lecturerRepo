"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  // isActive?: boolean
  onClick?: ()=> void
}

export default function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  const path = usePathname();
  const [isActive, setIsActive] = useState(false);
  useEffect(
    function () {
      const genPath = path.split("");
      const genHref = href.split("");
      if (genPath[1] === genHref[1]) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    },
    [path, href]
  );
  return (
    <Link
    onClick={onClick}
      href={href}
      className={cn(
        "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
        isActive
          ? "bg-[#1c28414d] text-white"
          : "text-gray-400 hover:bg-gray-600"
      )}
    >
      <span className="text-gray-500 dark:text-gray-400 mr-3">{icon}</span>
      <span className="inline">{label}</span>
    </Link>
  );
}
