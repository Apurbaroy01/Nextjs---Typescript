"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Logout } from "@/services/logout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Dashboard", href: "/dashboard" },
];

type UserDataType = {
  success: boolean
  statusCode: number
  message: string
  data: {
    profile: {
      id: string
      name: string
      email: string
      activeStatus: string
      role: string
      createdAt: string
      updatedAt: string
    }
  }
}

interface NavbarProps {
  data: UserDataType;
}

export function Navbar({ data }: NavbarProps) {
  console.log("navbar data => ", data)

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await Logout();

      toast.success("You have been logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error("লগআউট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Text */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          NextPulse
        </Link>

        {/* Nav Links (Centered) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-8 rounded-full p-0">
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@user"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-sm font-medium pl-3">{`${data.data.profile.name}`}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-muted-foreground pl-3">{`${data.data.profile.email}`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()} disabled={isLoading} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                <span>{isLoading ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
