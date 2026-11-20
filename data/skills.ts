import type { Locale } from "@/lib/i18n";
import { skillGroupTitlesEn } from "./en";

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Frontend",
    items: ["TypeScript, JavaScript", "React.js", "Angular", "Vue.js, Nuxt.js", "Tailwind, Shadcn, PrimeVue", "HTML, CSS"],
  },
  { title: "Mobile", items: ["React Native", "Expo", "OTA Updates"] },
  {
    title: "Backend",
    items: ["Node.js, NestJS", "Golang, Gin", "Spring Boot, Java", "Symfony, PHP", "WebSockets, Socket.io", "OpenAI API"],
  },
  {
    title: "Bases de données",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma, Sequelize", "GORM, Hibernate, Mongoose"],
  },
  {
    title: "Infrastructure & DevOps",
    items: ["Docker, Nginx", "Kubernetes, Helm, ArgoCD", "GitLab CI/CD", "Azure, AWS", "Keycloak", "Sentry, PostHog, ELK"],
  },
];

export function getSkillGroups(lang: Locale = "fr") {
  if (lang === "fr") return skillGroups;
  return skillGroups.map((g) => ({ ...g, title: skillGroupTitlesEn[g.title] ?? g.title }));
}
