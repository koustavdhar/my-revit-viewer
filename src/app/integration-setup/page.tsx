"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Input, MoreMenu, PageContainer, SectionHeader, Select } from "@/components/ui";

const STORAGE_KEY = "my-revit-viewer-integration-setup";

type ChecklistItem = {
  id: string;
  label: string;
};

const checklistItems: ChecklistItem[] = [
  { id: "account", label: "Speckle account created" },
  { id: "connector", label: "Revit connector installed" },
  { id: "signed-in", label: "Signed in from Revit" },
  { id: "published", label: "Test model published" },
  { id: "link-copied", label: "Model link copied" },
];

type StoredShape = {
  checked: Record<string, boolean>;
  modelUrl: string;
  notes: string;
};

export default function IntegrationSetupPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [modelUrl, setModelUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [platform, setPlatform] = useState("speckle");
  const [hydrated, setHydrated] = useState(false);
  const skipNextSave = useRef(true);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as Partial<StoredShape>;
          if (data.checked && typeof data.checked === "object") {
            setChecked(data.checked);
          }
          if (typeof data.notes === "string") {
            setNotes(data.notes);
          }
          if (typeof data.modelUrl === "string") {
            setModelUrl(data.modelUrl);
          }
        }
      } catch {
        // ignore corrupt storage
      }
      skipNextSave.current = true;
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      const payload: StoredShape = { checked, modelUrl, notes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // quota or private mode
    }
  }, [checked, modelUrl, notes, hydrated]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function resetDemoState() {
    setChecked({});
    setModelUrl("");
    setNotes("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Integration"
        title="Integration setup"
        description="Checklist and notes for preparing a test model. Data stays in this browser (localStorage) — nothing is sent to a server."
        className="border-b border-[color:var(--border-subtle)] pb-[length:var(--space-3)]"
        size="compact"
      />

      <div className="grid gap-[length:var(--layout-grid-gap)] lg:grid-cols-2 lg:gap-[length:var(--space-4)]">
        <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)] md:p-[length:var(--card-padding-loose)]">
          <h2 className="card-section-title">Setup checklist</h2>
          <p className="mt-1 text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Check off each step as you complete it.
          </p>
          <ul className="mt-[length:var(--space-3)] flex flex-col gap-[length:var(--layout-inline-gap)]">
            {checklistItems.map((item) => {
              const isOn = !!checked[item.id];
              return (
                <li key={item.id}>
                  <label
                    className={[
                      "flex cursor-pointer items-start gap-[length:var(--layout-inline-gap)] rounded-[var(--radius-md)] border px-[length:var(--space-2)] py-[length:var(--space-2)] transition-colors",
                      isOn
                        ? "border-[color:var(--primary-100)] bg-[color:var(--primary-50)] ring-1 ring-[color:color-mix(in_srgb,var(--primary)_15%,transparent)]"
                        : "border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] hover:border-[color:var(--border)] hover:bg-[color:color-mix(in_srgb,var(--primary-50)_18%,var(--surface-muted))] active:scale-[0.995]",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-[color:var(--border-strong)] text-[color:var(--primary)] focus:ring-[color:var(--primary)] focus:ring-offset-0"
                    />
                    <span className="text-[length:var(--text-sm)] font-semibold text-[color:var(--text)]">{item.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)] shadow-[var(--shadow-xs)] md:p-[length:var(--card-padding-loose)]">
          <h2 className="card-section-title">Notes &amp; model URL</h2>
          <p className="mt-1 text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Keep stream URLs and implementation notes here for handoff to engineering.
          </p>
          <div className="mt-[length:var(--space-3)] flex flex-col gap-[length:var(--layout-section-gap)]">
            <div>
              <label htmlFor="integration-platform" className="form-field-label">
                Integration platform
              </label>
              <Select id="integration-platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="speckle">Speckle (current)</option>
                <option value="aps">Autodesk APS (future)</option>
              </Select>
            </div>
            <div>
              <label htmlFor="integration-model-url" className="form-field-label">
                Model URL
              </label>
              <Input
                id="integration-model-url"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                placeholder="https://app.speckle.systems/projects/…"
              />
            </div>
            <div>
              <label htmlFor="integration-notes" className="form-field-label">
                Implementation notes
              </label>
              <textarea
                id="integration-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Branch details, commit IDs, or environment notes…"
                rows={10}
                className="ui-focus-ring w-full resize-y rounded-[var(--radius-sm)] border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-2 py-2 text-[length:var(--text-xs)] text-[color:var(--text)] shadow-[var(--shadow-xs)] placeholder:text-[color:var(--text-subtle)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-0"
                spellCheck={false}
              />
            </div>
          </div>
          <p className="mt-3 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-subtle)]">
            Tip: copy stream, branch, or commit links from Speckle — the same identifiers apply when wiring the SDK.
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-[length:var(--layout-inline-gap)] border-t border-[color:var(--border-subtle)] pt-[length:var(--space-3)]">
        <Button href="/dashboard" variant="secondary" size="md">
          Back to dashboard
        </Button>
        <MoreMenu
          items={[
            { key: "reset", label: "Reset demo state", onClick: resetDemoState },
          ]}
        />
        <Link
          href="/"
          className="text-[length:var(--text-xs)] font-semibold text-[color:var(--text-muted)] hover:text-[color:var(--text)]"
        >
          ← Home
        </Link>
      </div>
    </PageContainer>
  );
}
