import { Button, Card, PageContainer } from "@/components/ui";

export default function Home() {
  const features = [
    {
      title: "Browser-based Revit viewing",
      description:
        "Open project models from any modern browser with no local plugin setup.",
    },
    {
      title: "Read-only access",
      description:
        "Model data stays protected with controlled, view-only collaboration.",
    },
    {
      title: "Project dashboard",
      description:
        "Track model status, updates, and project context from one clean workspace.",
    },
    {
      title: "Element property inspection",
      description:
        "Review core element details in a structured side panel during model review.",
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <PageContainer className="py-[length:var(--space-8)] md:py-10">
        <div className="grid gap-[length:var(--space-5)] rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-[length:var(--space-5)] shadow-[var(--shadow-sm)] md:grid-cols-[1.2fr_0.8fr] md:gap-[length:var(--space-6)] md:p-[length:var(--space-8)]">
          <div>
            <p className="label-eyebrow mb-[length:var(--space-3)]">AEC workspace</p>
            <h1 className="section-title max-w-2xl">
              Model review for Revit and spatial data programs
            </h1>
            <p className="mt-5 max-w-xl text-[length:var(--text-base)] leading-relaxed text-[color:var(--text-muted)]">
              A disciplined browser interface to open models, review project context, and inspect element and GIS
              attributes without edit risk.
            </p>
            <div className="mt-[length:var(--space-6)] flex flex-wrap gap-[length:var(--layout-inline-gap)]">
              <Button href="/login" variant="primary" size="md" className="px-4">
                Start demo
              </Button>
              <Button href="/dashboard" variant="secondary" size="md" className="px-4">
                Open dashboard
              </Button>
            </div>
          </div>
          <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding-loose)] md:p-[length:var(--space-5)]">
            <p className="label-eyebrow mb-[length:var(--space-3)]">Version 1 scope</p>
            <ul className="flex flex-col gap-[length:var(--space-2)] text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text)]">
              <li>Read-only model and map viewing</li>
              <li>Project dashboard and detail pages</li>
              <li>No editing, comments, or clash workflows</li>
              <li>No AI assistant in this version</li>
            </ul>
            <div className="mt-[length:var(--space-4)] rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding)] text-[length:var(--text-sm)] text-[color:var(--text-muted)]">
              Designed for controlled BIM and GIS visibility across project stakeholders.
            </div>
          </Card>
        </div>
      </PageContainer>

      <PageContainer className="pb-[length:var(--space-6)]">
        <div className="mb-[length:var(--space-4)]">
          <p className="label-eyebrow">Capabilities</p>
          <h2 className="mt-2 text-heading-md">Built for practical review</h2>
        </div>
        <div className="grid gap-[length:var(--layout-grid-gap)] md:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-[color:var(--border-subtle)] p-[length:var(--card-padding-loose)] md:p-[length:var(--space-5)]"
            >
              <div className="mb-[length:var(--space-3)] flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="M4 5.5h12M4 10h12M4 14.5h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-[length:var(--text-md)] font-bold text-[color:var(--text)]">{feature.title}</h3>
              <p className="mt-2 text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer className="py-[length:var(--space-6)]">
        <Card className="border-[color:var(--border-subtle)] p-[length:var(--space-5)] md:p-[length:var(--space-6)]">
          <p className="label-eyebrow">How it works</p>
          <div className="mt-[length:var(--space-4)] grid gap-[length:var(--layout-grid-gap)] md:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding-loose)]">
              <p className="text-[length:var(--text-sm)] font-bold text-[color:var(--text)]">1. Sign in</p>
              <p className="mt-2 text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
                Access the workspace through the demo login.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding-loose)]">
              <p className="text-[length:var(--text-sm)] font-bold text-[color:var(--text)]">2. Open project</p>
              <p className="mt-2 text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
                Select a project from the portfolio control center.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding-loose)]">
              <p className="text-[length:var(--text-sm)] font-bold text-[color:var(--text)]">3. Review model</p>
              <p className="mt-2 text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
                Inspect geometry and properties in read-only mode.
              </p>
            </div>
          </div>
        </Card>
      </PageContainer>

      <PageContainer className="pb-[length:var(--space-8)]">
        <Card className="flex flex-col items-start justify-between gap-[length:var(--space-4)] border-[color:var(--border-subtle)] p-[length:var(--space-5)] md:flex-row md:items-center md:p-[length:var(--space-6)]">
          <div>
            <h2 className="text-heading-md">Ready to walk the workspace?</h2>
            <p className="mt-2 text-[length:var(--text-sm)] text-[color:var(--text-muted)]">
              Use the demo login and browse projects in the full application shell.
            </p>
          </div>
          <Button href="/login" variant="primary" size="md" className="px-4">
            Open demo app
          </Button>
        </Card>
      </PageContainer>

      <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="shell-content flex flex-wrap items-center justify-between gap-[length:var(--layout-inline-gap)] py-[length:var(--space-3)] text-[length:var(--text-sm)] text-[color:var(--text-muted)]">
          <p className="font-semibold text-[color:var(--text)]">My Revit Viewer</p>
          <p>Read-only BIM / GIS review for AEC and infrastructure teams</p>
        </div>
      </footer>
    </main>
  );
}
