import { Button, Card, PageContainer, SectionHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Workspace"
        title="Settings"
        description="Placeholder for enterprise configuration — teams, permissions, and integrations."
        className="border-b border-[color:var(--border-subtle)] pb-[length:var(--space-3)]"
        size="compact"
      />
      <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)]">
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--text-muted)]">
          This area is intentionally minimal in v1. Extend with SSO, roles, data residency, and connector credentials
          as the product matures.
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
