/** Home sections, shared by the header and the mobile menu. Labels come from the dictionary. */
export const navItems = [
  { id: "projets", path: "/#projets" },
  { id: "experience", path: "/#experience" },
  { id: "competences", path: "/#competences" },
  { id: "contact", path: "/#contact" },
] as const;

/** The Lab is a page of its own, not a home section: it gets its own console-style link on the right of the header. */
export const labItem = { id: "lab", path: "/lab" } as const;

export type NavId = (typeof navItems)[number]["id"] | typeof labItem.id;
