import { Button, Card, PageContainer } from "@/components/ui";

export default function ViewerEmptyPage() {
  return (
    <PageContainer className="flex min-h-[50dvh] items-center justify-center">
      <Card className="w-full max-w-md border-[color:var(--border-subtle)] p-[length:var(--card-padding-loose)]">
        <p className="label-key">Viewer</p>
        <h1 className="mt-1 text-[length:var(--text-md)] font-bold tracking-tight text-[color:var(--text)]">
          No project selected
        </h1>
        <p className="mt-1.5 text-[length:var(--text-xs)] leading-snug text-[color:var(--text-muted)]">
          Open a project from the dashboard or project detail page to load the BIM/GIS workspace in read-only mode.
        </p>
        <div className="mt-[length:var(--space-3)] flex flex-wrap gap-[length:var(--layout-inline-gap)]">
          <Button href="/dashboard" variant="primary" size="md">
            Dashboard
          </Button>
          <Button href="/viewer/sp-bim-001" variant="secondary" size="md">
            Open sample viewer
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
