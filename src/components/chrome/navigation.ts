export type NavItem = {
  id: string;
  label: string;
  num: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", num: "00", href: "/" },
  { id: "story", label: "Story", num: "01", href: "/story" },
  { id: "services", label: "Services", num: "02", href: "/services" },
  { id: "projects", label: "Projects", num: "03", href: "/projects" },
  { id: "impact", label: "Impact", num: "04", href: "/impact" },
  { id: "journal", label: "Journal", num: "05", href: "/journal" },
];

export function routeIdFromPath(pathname: string): string {
  if (pathname === "/" || pathname === "") return "home";
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg ?? "home";
}
