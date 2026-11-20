/** Home sections and pages, shared by the header and the mobile menu. Labels come from the dictionary. */
export const navItems = [
  { id: "projets", path: "/#projets" },
  { id: "experience", path: "/#experience" },
  { id: "competences", path: "/#competences" },
  { id: "lab", path: "/lab" },
  { id: "contact", path: "/#contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];
