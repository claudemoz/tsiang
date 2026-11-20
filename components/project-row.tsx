import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectThumb } from "./project-media";
import { StackLine } from "./primitives";

export type ProjectRowLabels = {
  sector: string;
  platforms: string;
  setting: string;
  period: string;
  technologies: string;
};

/** Rendered inside the client filter, so everything comes in as plain props. */
export function ProjectRow({
  project,
  href,
  labels,
  diagramCaption,
}: {
  project: Project;
  href: string;
  labels: ProjectRowLabels;
  diagramCaption?: string;
}) {
  const facts = [
    { label: labels.sector, value: project.domain },
    { label: labels.platforms, value: project.categories.join(", ") },
    { label: labels.setting, value: project.client },
    { label: labels.period, value: project.period },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <li className="group relative grid gap-6 py-10 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5 lg:col-span-4">
        <ProjectThumb
          project={project}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 40vw, 100vw"
          diagramCaption={diagramCaption}
        />
      </div>
      <div className="md:col-span-7 lg:col-span-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          <Link href={href} className="after:absolute after:inset-0 decoration-2 underline-offset-4 group-hover:underline">
            {project.title}
          </Link>
        </h2>
        <p className="mt-3 text-lg text-pretty">{project.summary}</p>
        <StackLine items={project.stack} className="mt-4" label={labels.technologies} />
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[15px] md:col-span-12 md:grid-cols-4 lg:col-span-3 lg:grid-cols-1 lg:content-start">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-muted-foreground">{f.label}</dt>
            <dd className="mt-0.5">{f.value}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
