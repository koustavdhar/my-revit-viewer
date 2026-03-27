"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  notes: string;
};

export default function IntegrationSetupPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
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
      const payload: StoredShape = { checked, notes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // quota or private mode
    }
  }, [checked, notes, hydrated]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function resetDemoState() {
    setChecked({});
    setNotes("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }

  return (
    <main className="app-shell flex flex-1 flex-col py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Speckle preparation
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Integration Setup
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Use this page as a checklist while you prepare a test model in Speckle. Nothing is sent to
          our server—your checklist and notes are saved in this browser (localStorage) so they
          survive refresh.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="panel p-6 md:p-8">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Setup checklist</h2>
          <p className="mb-5 text-sm text-slate-600">
            Check off each step as you complete it.
          </p>
          <ul className="space-y-3">
            {checklistItems.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-6 md:p-8">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Notes &amp; model URL</h2>
          <p className="mb-4 text-sm text-slate-600">
            Paste your Speckle model or stream URL here so you have it handy when you connect the
            viewer in code later.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: https://speckle.xyz/streams/..."
            rows={10}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            spellCheck={false}
          />
          <p className="mt-3 text-xs text-slate-500">
            Tip: from Speckle, you can copy the link to a stream, branch, or commit—your app will
            use the same identifiers when you wire up the SDK.
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={resetDemoState} className="btn-secondary">
          Reset demo state
        </button>
        <Link href="/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Home
        </Link>
      </div>
    </main>
  );
}
