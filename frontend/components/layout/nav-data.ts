import {
  BadgeDollarSign,
  HelpCircle,
  LayoutDashboard,
  Package,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import type { MessageKey } from "@/lib/i18n";

type NavItem = {
  labelKey: MessageKey;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  requiredRole?: "admin";
};

type NavSection = {
  labelKey: MessageKey;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    labelKey: "nav.general",
    items: [
      {
        labelKey: "nav.dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    labelKey: "nav.shop",
    items: [
      {
        labelKey: "nav.products",
        href: "/products",
        icon: Package,
        requiredRole: "admin",
      },
      {
        labelKey: "nav.categories",
        href: "/categories",
        icon: Shapes,
        requiredRole: "admin",
      },
    ],
  },
  {
    labelKey: "nav.support",
    items: [
      {
        labelKey: "nav.help",
        href: "/help",
        icon: HelpCircle,
      },
    ],
  },
];

export const brand: { name: string; taglineKey: MessageKey; icon: LucideIcon } = {
  name: "Hypesoft",
  taglineKey: "nav.tagline",
  icon: BadgeDollarSign,
};
