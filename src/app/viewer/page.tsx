import { Button, Card, PageContainer, SectionHeader } from "@/components/ui";

export default function ViewerEmptyPage() {
  return (
    <PageContainer className="py-10">
      <Card className="mx-auto w-full max-w-3xl p-8 text-center">
        <SectionHeader
          eyebrow="Viewer"
          title="No project selected"
          description="Choose a project first, then open its viewer. This keeps the workspace focused on one model at a time in read-only mode."
          size="compact"
        />
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/dashboard" variant="primary">
            Back to Dashboard
          </Button>
          <Button href="/projects/p-001" variant="secondary">
            Open Example Project
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
