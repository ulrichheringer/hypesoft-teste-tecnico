import { BadgeDollarSign, HelpCircle, LayoutDashboard, Package, Shapes } from "lucide-react";

export const navSections = [
  {
    label: "General",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Shop",
    items: [
      {
        label: "Produtos",
        href: "/products",
        icon: Package,
      },
      {
        label: "Categorias",
        href: "/categories",
        icon: Shapes,
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        label: "Ajuda",
        href: "/help",
        icon: HelpCircle,
      },
    ],
  },
];

export const brand = {
  name: "Hypesoft",
  tagline: "Product Ops",
  icon: BadgeDollarSign,
};
