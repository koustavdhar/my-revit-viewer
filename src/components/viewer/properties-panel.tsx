import type { ReactNode } from "react";
import { ElementItem } from "@/features/viewer/types";
import { Card, Divider } from "@/components/ui";

type PropertiesPanelProps = {
  selectedElement: ElementItem;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="inspector-section">
      <h3 className="inspector-section-title">{title}</h3>
      {children}
    </section>
  );
}

export default function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  return (
    <Card className="h-full border-[color:var(--border-subtle)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)]">
      <header className="inspector-section">
        <p className="label-eyebrow">Element properties</p>
        <p className="text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">Structured placeholder data</p>
      </header>

      <div className="inspector-panel-stack">
        <Section title="Summary">
          <dl className="inspector-dl inspector-dl-muted">
            <div className="inspector-attr-row inspector-attr-row--key">
              <dt className="inspector-field-label">Category</dt>
              <dd className="text-[length:var(--text-xs)] font-bold text-[color:var(--text)]">{selectedElement.category}</dd>
            </div>
            <div className="inspector-attr-row inspector-attr-row--key">
              <dt className="inspector-field-label">Element ID</dt>
              <dd className="font-mono text-[length:var(--text-2xs)] font-semibold text-[color:var(--text)]">{selectedElement.id}</dd>
            </div>
          </dl>
        </Section>

        <Section title="Classification">
          <dl className="inspector-dl">
            <div className="inspector-attr-row">
              <dt className="inspector-field-label">Family</dt>
              <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">{selectedElement.family}</dd>
            </div>
            <div className="inspector-attr-row">
              <dt className="inspector-field-label">Type</dt>
              <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">{selectedElement.type}</dd>
            </div>
          </dl>
        </Section>

        <Section title="Placement">
          <dl className="inspector-dl">
            <div className="inspector-attr-row">
              <dt className="inspector-field-label">Level</dt>
              <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">{selectedElement.level}</dd>
            </div>
            <div className="inspector-attr-row">
              <dt className="inspector-field-label">Material</dt>
              <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">{selectedElement.material}</dd>
            </div>
          </dl>
        </Section>
      </div>

      <Divider className="my-[length:var(--space-3)]" />
      <p className="text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">Read-only — editing disabled in v1.</p>
    </Card>
  );
}
