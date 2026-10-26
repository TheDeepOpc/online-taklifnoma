"use client";

import { Children, isValidElement, type CSSProperties, type ReactNode } from "react";
import type { SectionId, TemplateDesign } from "@/lib/templateDesigns";
import styles from "./BodyComposition.module.css";

export function BodyComposition({ design, children, className }: { design: TemplateDesign; children: ReactNode; className?: string }) {
  const sections = new Map<SectionId, ReactNode>();
  Children.toArray(children).forEach(child => {
    if (!isValidElement<{ sectionId?: SectionId; "data-section"?: SectionId }>(child)) return;
    const id = child.props.sectionId ?? child.props["data-section"];
    if (id) sections.set(id, child);
  });
  return <main className={`${styles.body} ${styles[design.hero] ?? ""} ${className ?? ""}`} data-body-composition={design.hero} style={{ "--body-columns": design.columns } as CSSProperties}>
    {design.groups.map((ids, index) => {
      const visible = ids.filter(id => sections.has(id));
      if (!visible.length) return null;
      return <div key={index} className={styles.group} data-paired={visible.length > 1 ? "true" : undefined} data-sections={visible.join("+")}>
        {visible.map(id => sections.get(id))}
      </div>;
    })}
  </main>;
}
