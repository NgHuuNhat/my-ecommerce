"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import {
  Search,
  ShoppingCart,
  User,
  Package,
  LogOut,
  Bell,
  HelpCircle,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session, status } = useSession();

  const user = session?.user;

  const hotKeywords = [
    "Iphone 15",
    "Áo thun nam",
    "Macbook Air",
    "Bàn phím cơ",
    "Tai nghe gaming",
    "Chuột Logitech",
    "Màn hình 2K",
  ];

  return (
    <header className="w-full bg-[#ee4d2d] text-white">
      {/* TOP HEADER */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[13px]">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button className="hover:opacity-80">
              Kênh Người Bán
            </button>

            <div className="h-4 w-px bg-white/30" />

            <button className="hover:opacity-80">
              Tải ứng dụng
            </button>

            <div className="h-4 w-px bg-white/30" />

            <button className="hover:opacity-80">
              Kết nối
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1 hover:opacity-80">
              <Bell size={14} />
              Thông báo
            </button>

            <button className="flex items-center gap-1 hover:opacity-80">
              <HelpCircle size={14} />
              Hỗ trợ
            </button>

            <button className="flex items-center gap-1 hover:opacity-80">
              <Globe size={14} />
              Tiếng Việt
            </button>

            {/* loading session */}
            {status === "loading" ? (
              <div className="h-5 w-20 animate-pulse rounded bg-white/20" />
            ) : !user ? (
              <>
                <div className="h-4 w-px bg-white/30" />

                <Link
                  href="#"
                  className="hover:opacity-80"
                >
                  Đăng ký
                </Link>

                <Link
                  href="/login"
                  className="hover:opacity-80"
                >
                  Đăng nhập
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80">
                    {/* avatar */}
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <User size={13} />
                      </div>
                    )}

                    <span>
                      {user.name || user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >
                  <DropdownMenuItem asChild>
                    <Link href="#">
                      <User size={16} />
                      Tài khoản của tôi
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="#">
                      <Package size={16} />
                      Đơn mua
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="mx-auto flex h-[90px] max-w-7xl items-center gap-10 px-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white text-3xl font-bold">
            S
          </div>

          <h1 className="text-3xl font-light tracking-tight">
            Shopee
          </h1>
        </Link>

        {/* SEARCH */}
        <div className="flex flex-1 flex-col">
          <div className="flex rounded-sm bg-white p-1 shadow-lg">
            <Input
              placeholder="Shopee bao ship 0Đ - Đăng ngay!"
              className="h-12 border-0 text-black shadow-none focus-visible:ring-0"
            />

            <Button className="h-12 rounded-sm bg-[#fb5533] px-7 hover:bg-[#f63d19]">
              <Search size={20} />
            </Button>
          </div>

          {/* HOT KEYWORDS */}
          <div className="mt-2 flex items-center gap-4 overflow-hidden text-xs text-white/90">
            {hotKeywords.map((item) => (
              <button
                key={item}
                className="hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* CART */}
        <button className="relative shrink-0">
          <ShoppingCart
            size={34}
            className="transition hover:scale-105"
          />

          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#ee4d2d]">
            2
          </span>
        </button>
      </div>
    </header>
  );
}