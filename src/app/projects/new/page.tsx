import { Button, Card, PageContainer, SectionHeader } from "@/components/ui";

export default function NewProjectPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Projects"
        title="Create project"
        description="Future workflow for authoring projects, spatial manifests, and viewer defaults."
        className="border-b border-[color:var(--border-subtle)] pb-[length:var(--space-3)]"
        size="compact"
      />
      <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)]">
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
          Creation is not implemented in this build. Add mock entries in{" "}
          <code className="rounded-[var(--radius-sm)] bg-[color:var(--surface-muted)] px-1.5 py-0.5 font-mono text-[length:var(--text-2xs)] text-[color:var(--text)]">
            src/features/projects/mock-projects.ts
          </code>{" "}
          to extend the portfolio.
        </p>
        <div className="mt-[length:var(--space-3)]">
          <Button href="/dashboard" variant="secondary" size="md">
            Back to dashboard
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
