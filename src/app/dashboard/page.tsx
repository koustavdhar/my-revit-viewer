"use client";

import { useEffect, useMemo, useState } from "react";
import { myProjects, sampleProjects } from "@/features/projects";
import type { MockProject } from "@/features/projects";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageContainer,
  Select,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TableBody,
  TableHead,
  TableRow,
  TableShell,
  TableTd,
  TableTh,
} from "@/components/ui";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"mine" | "samples">("mine");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setLoadError(null);
        setIsLoading(false);
      } catch {
        setLoadError("Could not load project data. Please refresh and try again.");
        setIsLoading(false);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  const disciplines = useMemo(() => {
    const all = [...myProjects, ...sampleProjects];
    return Array.from(new Set(all.map((project) => project.discipline))).sort();
  }, []);

  const visibleProjects = useMemo(() => {
    return activeTab === "mine" ? myProjects : sampleProjects;
  }, [activeTab]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return visibleProjects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.projectName.toLowerCase().includes(normalizedQuery) ||
        project.clientName.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesDiscipline =
        disciplineFilter === "all" || project.discipline === disciplineFilter;
      return matchesQuery && matchesStatus && matchesDiscipline;
    });
  }, [query, statusFilter, disciplineFilter, visibleProjects]);

  const totalProjects = visibleProjects.length;
  const activeProjects = visibleProjects.filter((project) => project.status === "Active").length;
  const reviewProjects = visibleProjects.filter((project) => project.status === "Review").length;
  const archivedProjects = visibleProjects.filter((project) => project.status === "Archived").length;
  const latestUpdate = visibleProjects
    .map((project) => project.lastUpdated)
    .sort((a, b) => (a > b ? -1 : 1))[0];

  function getStatusVariant(status: MockProject["status"]) {
    if (status === "Active") return "success";
    if (status === "Review") return "warning";
    return "neutral";
  }

  return (
    <PageContainer>
      <header className="flex flex-wrap items-center justify-between gap-[length:var(--layout-inline-gap)] border-b border-[color:var(--border-subtle)] pb-[length:var(--layout-section-gap)]">
        <div className="min-w-0 flex-1">
          <p className="label-key">Control center</p>
          <h1 className="mt-1 text-heading-md">Projects</h1>
          <p className="mt-1 max-w-xl text-[length:var(--text-xs)] leading-relaxed text-[color:var(--text-muted)]">
            Portfolio status, filters, and viewer entry points.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-[length:var(--layout-inline-gap)]">
          {activeTab === "mine" ? (
            <Button href="/projects/new" variant="primary" size="md">
              New project
            </Button>
          ) : null}
        </div>
      </header>

      {loadError ? (
        <AlertBanner title="Data load error" message={loadError} tone="error" />
      ) : null}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-[length:var(--layout-grid-gap)] lg:grid-cols-4">
        {[
          { label: "Total", value: totalProjects, dot: "var(--primary)" },
          { label: "Active", value: activeProjects, dot: "var(--success)" },
          { label: "In review", value: reviewProjects, dot: "var(--warning)" },
          { label: "Archived", value: archivedProjects, dot: "var(--text-subtle)" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-[length:var(--card-padding)]">
            <p className="label-key">{kpi.label}</p>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-6 w-12" />
            ) : (
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-[length:var(--text-lg)] font-bold tabular-nums text-[color:var(--text)]">
                  {kpi.value}
                </p>
                <span
                  className="mb-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: kpi.dot }}
                  aria-hidden
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding)]">
        <p className="label-key mb-[length:var(--space-2)]">Latest activity</p>
        {isLoading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <p className="font-mono text-[length:var(--text-xs)] font-semibold tabular-nums text-[color:var(--text)]">
            Last model update · {latestUpdate ?? "—"}
          </p>
        )}
      </Card>

      {/* Filters */}
      <div className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)]">
        <div className="mb-[length:var(--space-2)] flex flex-wrap items-end justify-between gap-[length:var(--layout-inline-gap)]">
          <div className="flex flex-wrap items-center gap-[length:var(--layout-inline-gap)]">
            <p className="label-key">Find &amp; filter</p>
            <TabList aria-label="Project source" className="ml-0 sm:ml-1">
              <Tab id="tab-mine" selected={activeTab === "mine"} onSelect={() => setActiveTab("mine")}>
                My Projects
              </Tab>
              <Tab id="tab-samples" selected={activeTab === "samples"} onSelect={() => setActiveTab("samples")}>
                Sample Projects
              </Tab>
            </TabList>
          </div>
          <span className="text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]">
            Search applies to name and client
          </span>
        </div>
        <div className="grid gap-[length:var(--layout-inline-gap)] sm:grid-cols-[minmax(0,1fr)_9.5rem_9.5rem] sm:items-end">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project or client"
            aria-label="Search projects"
          />
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Review">Review</option>
            <option value="Archived">Archived</option>
          </Select>
          <Select
            value={disciplineFilter}
            onChange={(event) => setDisciplineFilter(event.target.value)}
            aria-label="Filter by discipline"
          >
            <option value="all">All disciplines</option>
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-[length:var(--card-padding)]">
          <div className="flex flex-col gap-[length:var(--layout-inline-gap)]">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      ) : (
        <>
          <TabPanel id="panel-mine" labelledBy="tab-mine" hidden={activeTab !== "mine"}>
            {totalProjects === 0 ? (
              <Card className="p-[length:var(--card-padding)]">
                <EmptyState
                  title="No projects yet"
                  message="Create your first project to begin model review."
                  action={
                    <Button href="/projects/new" variant="primary">
                      New project
                    </Button>
                  }
                />
              </Card>
            ) : (
              <ProjectTable
                totalProjects={totalProjects}
                filteredProjects={filteredProjects}
                getStatusVariant={getStatusVariant}
                showSampleBadge={false}
              />
            )}
          </TabPanel>

          <TabPanel id="panel-samples" labelledBy="tab-samples" hidden={activeTab !== "samples"}>
            <ProjectTable
              totalProjects={totalProjects}
              filteredProjects={filteredProjects}
              getStatusVariant={getStatusVariant}
              showSampleBadge
            />
          </TabPanel>
        </>
      )}
    </PageContainer>
  );
}

function ProjectTable({
  totalProjects,
  filteredProjects,
  getStatusVariant,
  showSampleBadge,
}: {
  totalProjects: number;
  filteredProjects: MockProject[];
  getStatusVariant: (s: MockProject["status"]) => "success" | "warning" | "neutral";
  showSampleBadge: boolean;
}) {
  return (
    <div>
      <div className="mb-[length:var(--space-2)] flex flex-wrap items-baseline justify-between gap-[length:var(--layout-inline-gap)]">
        <p className="label-key">Project registry</p>
        <span className="font-mono text-[length:var(--text-2xs)] tabular-nums text-[color:var(--text-muted)]">
          {filteredProjects.length} of {totalProjects}
        </span>
      </div>
      <TableShell className="min-w-0">
        <TableHead>
          <TableRow>
            <TableTh className="w-[26%]">Project</TableTh>
            <TableTh className="w-[18%]">Client</TableTh>
            <TableTh className="w-[14%]">Discipline</TableTh>
            <TableTh className="w-[12%]">Status</TableTh>
            <TableTh className="w-[14%]">Updated</TableTh>
            <TableTh className="w-[16%] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableTd>
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="min-w-0 truncate font-semibold text-[color:var(--text)]">{project.projectName}</p>
                  {showSampleBadge ? (
                    <Badge variant="neutral" size="compact">
                      Sample
                    </Badge>
                  ) : null}
                </div>
                <p className="truncate font-mono text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                  {project.modelSource}
                </p>
              </TableTd>
              <TableTd className="font-medium text-[color:var(--text-muted)]">{project.clientName}</TableTd>
              <TableTd className="text-[color:var(--text-muted)]">{project.discipline}</TableTd>
              <TableTd>
                <Badge variant={getStatusVariant(project.status)} size="compact">
                  {project.status}
                </Badge>
              </TableTd>
              <TableTd className="whitespace-nowrap font-mono text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                {project.lastUpdated}
              </TableTd>
              <TableTd className="text-right">
                <div className="flex flex-wrap justify-end gap-1">
                  <Button href={`/viewer/${project.id}`} variant="primary" size="sm">
                    Viewer
                  </Button>
                  <Button href={`/projects/${project.id}`} variant="secondary" size="sm">
                    Detail
                  </Button>
                </div>
              </TableTd>
            </TableRow>
          ))}
          {filteredProjects.length === 0 ? (
            <TableRow>
              <TableTd colSpan={6} className="py-6">
                <EmptyState title="No matches" message="Clear search or widen filters." />
              </TableTd>
            </TableRow>
          ) : null}
        </TableBody>
      </TableShell>
    </div>
  );
}
