import { Fragment } from "react";
import { certificationForSkill } from "@/data/certifications";
import { getSkillGroups } from "@/data/skills";
import { getLocale } from "@/lib/locale";
import { CertifiedMark } from "./certified-mark";

export async function SkillsGrid() {
  const lang = await getLocale();
  return (
    <dl className="divide-y divide-border border-y border-border">
      {getSkillGroups(lang).map((g) => (
        <div key={g.title} className="grid gap-1 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
          <dt className="font-medium">{g.title}</dt>
          <dd className="text-muted-foreground text-pretty">
            {g.items.map((item, i) => {
              const cert = certificationForSkill(item);
              return (
                <Fragment key={item}>
                  {i > 0 ? ", " : null}
                  {cert ? (
                    <span className="whitespace-nowrap">
                      <span className="text-foreground">{item}</span>
                      <CertifiedMark cert={cert} lang={lang} />
                    </span>
                  ) : (
                    item
                  )}
                </Fragment>
              );
            })}
          </dd>
        </div>
      ))}
    </dl>
  );
}
