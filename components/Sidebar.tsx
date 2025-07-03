"use client";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  UserRoundPlus,
  X
} from "lucide-react";
import Image from "next/image";
// import { lecturerouter } from "next/navigation";
import { useOutsideClick } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NavLink from "./NavLink";

export default function Sidebar() {
  // const router = lecturerouter();
  const { lecturerLogout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const { lecturer } = useAuth();
  const ref = useOutsideClick(() => {
    setShowNav(false);
  });

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await lecturerLogout();
      // Force refresh to update UI state
      // Alternative: router.push('/') then router.refresh()
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local state
      // window.location.reload();
    } finally {
      setLogoutLoading(false);
    }
  };


  return (
    lecturer ? <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 bottom-0 h-full md:h-full w-[80px] md:w-64 bg-[#1c2841] border-r border-gray-200 dark:border-dark-border-subtle flex-col justify-between py-4 px-1 md:px-4 z-50">
        <div className="flex text-white font-semibold items-center justify-center md:justify-start mb-8 px-2">
          {/* <Link className="hidden md:block" href="/login"> */}
          LasuDrive
          <span className="text-white text-sm flex items-center flex-nowrap">
            <X className="block md:hidden mr-1" size={20} color="white" />
          </span>
        </div>

        <nav className="flex-1 flex flex-col items-center md:items-start space-y-1">
          <NavLink
            href="/"
            icon={<LayoutDashboard color="white" size={20} />}
            label="All Files"
          />
            <NavLink
              href="/courses"
              icon={<NotebookPen color="white" size={20} />}
              label="My Courses"
            />
          <NavLink
            href="/add-lecturer"
            icon={<UserRoundPlus color="white" size={20} />}
            label="Add Lecturer"
          />
          
          
        </nav>

        <div
          onClick={handleLogout}
          className="flex items-center px-1 py-2 text-sm font-medium rounded-md group text-red-600 hover:bg-gray-600 cursor-pointer w-fit"
        >
          <span className="mr-3">
            <LogOut color="red" size={20} />
          </span>
          <span className="hidden md:inline">
            {logoutLoading ? "Logging out.." : "Logout"}
          </span>
        </div>
        {/* </div> */}
      </aside>

      <aside
        ref={ref}
        className={cn(
          `fixed inset-y-0 left-0 bottom-0 h-full md:h-full w-[200px] md:w-64 bg-[#1c2841] dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-dark-border-subtle flex md:hidden flex-col justify-between py-4 px-1 md:px-4 transition-all z-40 ${
            !showNav ? "-translate-x-[100%]" : "-translate-x-0"
          }`
        )}
      >
        <div className="flex h-[50px] relative justify-center md:justify-start mb-8 px-2">
          <Image
            className={`w-[200px] cursor-pointer block`}
            height={100}
            width={100}
            src="/logo.svg"
            alt="Logo"
            priority
          />
          <span
            onClick={() => setShowNav((c) => !c)}
            className="text-white text-sm flex absolute left-[100%] items-center flex-nowrap bg-[#1c2841] p-2 rounded-r-[8px]"
          >
            {showNav ? (
              <X className="block md:hidden mr-1" size={20} color="white" />
            ) : (
              <Menu className="block md:hidden mr-1" size={20} color="white" />
            )}
          </span>
          
        </div>

        <nav className="flex-1 flex flex-col md:items-start space-y-1">
          <NavLink
            onClick={() => setShowNav(false)}
            href="/"
            icon={<LayoutDashboard color="white" size={20} />}
            label="All Files"
          />
            <NavLink
              onClick={() => setShowNav(false)}
              href="/courses"
              icon={<NotebookPen color="white" size={20} />}
              label="My Courses"
            />
          <NavLink
            onClick={() => setShowNav(false)}
            href="/add-lecturer"
            icon={<UserRoundPlus color="white" size={20} />}
            label="Add Lecturer"
          />
          
        </nav>
        <div
          onClick={handleLogout}
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-red-600 hover:bg-gray-600 cursor-pointer w-fit"
        >
          <span className="mr-3">
            <LogOut color="red" size={20} />
          </span>
          <span className="inline">
            {logoutLoading ? "Logging out.." : "Logout"}
          </span>
        </div>
        {/* </div> */}
      </aside>
    </> : <></>
  );
}
