"use client";

import { useEffect, useMemo, useState } from "react";
import { projects } from "@/features/projects";
import type { MockProject } from "@/features/projects";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageContainer,
  SectionHeader,
  Select,
  Skeleton,
} from "@/components/ui";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
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

  const disciplines = useMemo(
    () => Array.from(new Set(projects.map((project) => project.discipline))).sort(),
    [],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.projectName.toLowerCase().includes(normalizedQuery) ||
        project.clientName.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesDiscipline =
        disciplineFilter === "all" || project.discipline === disciplineFilter;
      return matchesQuery && matchesStatus && matchesDiscipline;
    });
  }, [query, statusFilter, disciplineFilter]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((project) => project.status === "Active").length;
  const latestUpdate = projects
    .map((project) => project.lastUpdated)
    .sort((a, b) => (a > b ? -1 : 1))[0];

  function getStatusVariant(status: MockProject["status"]) {
    if (status === "Active") return "success";
    if (status === "Review") return "warning";
    return "neutral";
  }

  return (
    <PageContainer className="py-6">
      <section className="w-full">
        <SectionHeader
          eyebrow="Enterprise Project Control Center"
          title="Projects Dashboard"
          description="Structured oversight for project health, discipline workflow, and model review readiness."
          className="mb-5"
          size="compact"
          actions={
            <Button href="/projects/new" variant="primary">
              Create Project
            </Button>
          }
        />

        {loadError ? (
          <AlertBanner
            title="Data load error"
            message={loadError}
            tone="error"
            className="mb-4"
          />
        ) : null}

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="label-key">Total projects</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-slate-900">{totalProjects}</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="label-key">Active projects</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-slate-900">{activeProjects}</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="label-key">Latest update</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-28" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-slate-900">{latestUpdate}</p>
            )}
          </Card>
        </div>

        <Card className="mb-4 p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_200px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by project or client"
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
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : totalProjects === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No projects yet"
                  message="Create your first project to begin model review."
                  action={
                    <Button href="/projects/new" variant="primary">
                      Create Project
                    </Button>
                  }
                />
              </div>
            ) : (
              <table className="w-full min-w-[860px] table-fixed text-left text-sm">
              <thead className="label-table border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="w-[28%] px-4 py-3 font-semibold">Project</th>
                  <th className="w-[20%] px-4 py-3 font-semibold">Client</th>
                  <th className="w-[16%] px-4 py-3 font-semibold">Discipline</th>
                  <th className="w-[14%] px-4 py-3 font-semibold">Status</th>
                  <th className="w-[12%] px-4 py-3 font-semibold">Last Updated</th>
                  <th className="w-[10%] px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="truncate font-medium text-slate-900">{project.projectName}</p>
                      <p className="truncate text-xs text-slate-500">{project.modelSource}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{project.clientName}</td>
                    <td className="px-4 py-3 text-slate-700">{project.discipline}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{project.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button href={`/viewer/${project.id}`} variant="secondary" size="sm">
                          Open Viewer
                        </Button>
                        <Button href={`/projects/${project.id}`} variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6">
                      <EmptyState
                        title="No matching projects"
                        message="Try clearing search or adjusting your filters."
                      />
                    </td>
                  </tr>
                ) : null}
              </tbody>
              </table>
            )}
          </div>
        </Card>
      </section>
    </PageContainer>
  );
}
