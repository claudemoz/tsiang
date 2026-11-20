import { imageSrc } from "./media";

/**
 * Certifications (Dyma). Each one is attached to what it proves:
 * `skill` is the exact item in data/skills.ts, `stack` the names used in project stacks.
 */
export type Certification = {
  title: string;
  url: string;
  /** Certificate scan, shown large in a dialog from the list. */
  image: { src: string; width: number; height: number };
  skill: string;
  stack: string[];
};

export const CERTIFIER = "Dyma";

const base = "https://dyma.fr/certification/6299c13dc1feb6a539a0084a/";

export const certifications: Certification[] = [
  {
    title: "Kubernetes",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199526/tsiang.fr/certifications/k8s_din27j.webp", 1681, 1165),
    url: `${base}645e595690ccf96f7c67665c`,
    skill: "Kubernetes, Helm, ArgoCD",
    stack: ["Kubernetes"],
  },
  {
    title: "Golang",
    image: imageSrc("/images/certifications/gocertif.webp", 1680, 1168),
    url: `${base}68a857338a8c63e8f2c7c320`,
    skill: "Golang, Gin",
    stack: ["Go", "Golang"],
  },
  {
    title: "GitLab CI/CD",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199526/tsiang.fr/certifications/gitlabcertif_i0kvl9.webp", 1678, 1162),
    url: `${base}64f5fde853b8f78052334a41`,
    skill: "GitLab CI/CD",
    stack: ["GitLab CI/CD"],
  },
  {
    title: "Node.js",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199528/tsiang.fr/certifications/nodecertif_gcqumu.webp", 1676, 1164),
    url: `${base}5c69b1d1606df31e473253d8`,
    skill: "Node.js, NestJS",
    stack: ["Node.js"],
  },
  {
    title: "Java, Spring Boot",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199526/tsiang.fr/certifications/springboot_d2pavp.webp", 1683, 1167),
    url: `${base}64799f7159ebb4f1e99bfb8b`,
    skill: "Spring Boot, Java",
    stack: ["Java", "Spring Boot"],
  },
  {
    title: "React",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199527/tsiang.fr/certifications/reactcertif_imkaga.webp", 1678, 1161),
    url: `${base}628e08287436c6ee0c1480b9`,
    skill: "React.js",
    stack: ["React"],
  },
  {
    title: "React Native",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199527/tsiang.fr/certifications/reactnativecertif_zaeoqx.webp", 1673, 1163),
    url: `${base}65744295e13eacdd4ee601dc`,
    skill: "React Native",
    stack: ["React Native"],
  },
  {
    title: "Vue.js 3",
    image: imageSrc("https://res.cloudinary.com/daogrxxyw/image/upload/v1795199527/tsiang.fr/certifications/vuecertif_cg8bac.webp", 1687, 1162),
    url: `${base}6213ef21bcbb7ac87308139c`,
    skill: "Vue.js, Nuxt.js",
    stack: ["Vue.js"],
  },
];

export const certificationForSkill = (skill: string) => certifications.find((c) => c.skill === skill);
export const certificationForStack = (tech: string) => certifications.find((c) => c.stack.includes(tech));
