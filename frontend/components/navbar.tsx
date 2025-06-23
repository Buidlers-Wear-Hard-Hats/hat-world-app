"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coins, User, ListTodo } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2C2C5A] border-t border-[#F5AD00]/20">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/" ? "text-[#F5AD00]" : "text-white/70"
            }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* <Link
          href="/claim"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/claim" ? "text-[#F5AD00]" : "text-white/70"
            }`}
        >
          <Coins className="h-6 w-6" />
          <span className="text-xs mt-1">Claim</span>
        </Link> */}

        <Link
          href="/tasks"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/tasks" ? "text-[#F5AD00]" : "text-white/70"
            }`}
        >
              <ListTodo className="h-6 w-6" />
              <span className="text-xs mt-1">Tasks</span>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/profile" ? "text-[#F5AD00]" : "text-white/70"
                }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C5A] border-[#F5AD00]/20 text-white max-w-[90%] sm:max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-[#F5AD00] text-center font-pixel text-2xl">Coming Soon</DialogTitle>
            </DialogHeader>
            <p className="text-center py-4 font-pixel text-white/80">This functionality will be available soon.</p>
            <div className="flex justify-center mt-4">
              <DialogClose asChild>
                <Button className="bg-[#F5AD00] hover:bg-[#F5AD00]/80 text-[#2C2C5A] font-pixel">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </nav>
  );
} 