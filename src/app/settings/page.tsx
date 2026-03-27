import { Button, Card, PageContainer, SectionHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <PageContainer className="py-10">
      <div className="w-full">
        <SectionHeader
          eyebrow="Workspace"
          title="Settings"
          description="Placeholder settings page for future enterprise configuration."
          className="mb-6"
          size="compact"
        />
        <Card className="p-6">
          <p className="text-sm text-slate-600">
            This section is intentionally minimal in v1. Add team settings,
            permissions, and integration settings in future versions.
          </p>
          <div className="mt-4">
            <Button href="/dashboard" variant="secondary">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
