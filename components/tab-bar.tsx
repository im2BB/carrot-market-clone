"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  UserIcon as SolidUserIcon,
  ShoppingBagIcon as SolidShoppingBagIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  UserIcon as OutlineUserIcon,
  ShoppingBagIcon as OutlineShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/home",
      label: "홈",
      icon: pathname === "/home" ? SolidHomeIcon : OutlineHomeIcon,
    },
    {
      href: "/life",
      label: "커뮤니티",
      icon: pathname === "/life" ? SolidNewspaperIcon : OutlineNewspaperIcon,
    },
    {
      href: "/chat",
      label: "채팅",
      icon: pathname === "/chat" ? SolidChatIcon : OutlineChatIcon,
    },
    {
      href: "/products",
      label: "상품",
      icon:
        pathname === "/products"
          ? SolidShoppingBagIcon
          : OutlineShoppingBagIcon,
    },
    {
      href: "/profile",
      label: "프로필",
      icon: pathname === "/profile" ? SolidUserIcon : OutlineUserIcon,
    },
  ];

  return (
    <div className="pwa-nav">
      <div className="flex justify-around items-center max-w-screen-sm mx-auto px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 touch-feedback
                ${
                  isActive
                    ? "text-orange-500 bg-orange-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
