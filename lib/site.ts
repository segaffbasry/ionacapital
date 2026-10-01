/* The live site's structure: header nav, socials, and the on-page sections the menu can scroll to. */
import home from "@/content/home.json";
import type { BrandIcon } from "@/lib/brand-icons";
import type { Link } from "@/lib/content";

export type NavGroup = Link & { children: Link[] };
export const nav = home.nav as NavGroup[];

export const contact = { label: "Contact Us", href: "https://ionacapital.co.uk/contact-us/" };

const iconFor: Record<string, BrandIcon> = { Twitter: "x", Linkedin: "linkedin" };
// The live header shows X (Twitter) and LinkedIn icons plus an envelope linking to /contact-us/ (kept as a text link).
export const socials = home.socials.filter((s) => iconFor[s.label]).map((s) => ({ name: s.label === "Twitter" ? "X" : "LinkedIn", href: s.href, icon: iconFor[s.label] }));

export const onPage = [
  { label: "Home", href: "#top" },
  { label: "Purpose", href: "#purpose" },
  { label: "Investment Focus", href: "#focus" },
  { label: "Investments", href: "#investments" },
  { label: "Articles", href: "#articles" },
  { label: "Investors & Developers", href: "#partners" },
];
