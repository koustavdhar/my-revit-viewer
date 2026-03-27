import { Button, Card, PageContainer, SectionHeader } from "@/components/ui";

export default function NewProjectPage() {
  return (
    <PageContainer className="py-10">
      <div className="w-full">
        <SectionHeader
          eyebrow="Projects"
          title="Create Project"
          description="Placeholder screen for future project creation workflow."
          className="mb-6"
          size="compact"
        />
        <Card className="p-6">
          <p className="text-sm text-slate-600">
            Project creation is not implemented in this prototype. Use mock data in
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
              src/features/projects/mock-projects.ts
            </code>
            to add sample projects.
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
