import type { ReactNode } from "react";
import { getProjectById } from "@/features/projects";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  PageContainer,
  SectionHeader,
} from "@/components/ui";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return (
      <PageContainer className="py-10">
        <div className="w-full">
          <EmptyState
            title="Project not found"
            message="The requested project does not exist or was removed."
            action={
              <Button href="/dashboard" variant="secondary">
                Back to Dashboard
              </Button>
            }
          />
        </div>
      </PageContainer>
    );
  }

  const modelLinkReady = !!project.modelUrl;
  const connectionStatus = modelLinkReady ? "Connected" : "Pending";
  const sourceLabel = project.modelSource || "Speckle";

  const metadataRows: { label: string; value: string | ReactNode }[] = [
    { label: "Client", value: project.clientName },
    { label: "Location", value: project.location },
    { label: "Discipline", value: project.discipline },
    {
      label: "Status",
      value: (
        <Badge
          variant={
            project.status === "Active"
              ? "success"
              : project.status === "Review"
                ? "warning"
                : "neutral"
          }
        >
          {project.status}
        </Badge>
      ),
    },
  ];

  return (
    <PageContainer className="py-10">
      <div className="w-full">
        <SectionHeader
          eyebrow="Project Detail"
          title={project.projectName}
          description={`${project.clientName} · ${project.location}`}
          className="mb-6"
          size="compact"
          actions={
            <>
              <Button href="/projects/new" variant="secondary" size="sm">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="pointer-events-none opacity-60">
                Delete
              </Button>
              <Button href={`/viewer/${project.id}`} variant="primary" size="sm">
                Open Viewer
              </Button>
            </>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <h2 className="label-eyebrow text-sm">
              Project Metadata
            </h2>
            <Divider className="my-4" />
            {!modelLinkReady ? (
              <AlertBanner
                title="Connection pending"
                message="No model URL has been linked yet. Viewer embed will remain unavailable until a valid model URL is configured."
                tone="warning"
                className="mb-4"
              />
            ) : null}
            <dl className="space-y-2.5 text-sm">
              {metadataRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[140px_1fr] items-center gap-3 border-b border-slate-100 pb-2.5 last:border-b-0 last:pb-0"
                >
                  <dt className="label-key">{row.label}</dt>
                  <dd className="font-medium text-slate-900">{row.value}</dd>
                </div>
              ))}
            </dl>
            <Divider className="my-4" />
            <div>
              <p className="mb-2 text-sm font-medium text-slate-500">Description</p>
              <p className="text-sm leading-6 text-slate-700">{project.description}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="label-eyebrow text-sm">
              Model Information
            </h2>
            <Divider className="my-4" />
            <dl className="space-y-2.5 text-sm">
              <div className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-slate-100 pb-2.5">
                <dt className="label-key">Source</dt>
                <dd className="font-medium text-slate-900">{sourceLabel}</dd>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-slate-100 pb-2.5">
                <dt className="label-key">Model link</dt>
                <dd className="font-medium text-slate-900">
                  {modelLinkReady ? (
                    <a
                      href={project.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-slate-700 underline hover:text-slate-900"
                    >
                      Available
                    </a>
                  ) : (
                    "Not linked"
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-slate-100 pb-2.5">
                <dt className="label-key">Last updated</dt>
                <dd className="font-medium text-slate-900">{project.lastUpdated}</dd>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                <dt className="label-key">Connection</dt>
                <dd>
                  <Badge variant={modelLinkReady ? "success" : "warning"}>
                    {connectionStatus}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="mt-6">
          <Button href="/dashboard" variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
