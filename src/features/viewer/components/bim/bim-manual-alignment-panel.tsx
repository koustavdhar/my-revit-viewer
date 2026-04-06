"use client";

import type { BimManualAlignment } from "@/features/viewer/bim/bim-manual-alignment";
import { Button, Card, Divider, Input } from "@/components/ui";

type BimManualAlignmentPanelProps = {
  value: BimManualAlignment;
  onChange: (patch: Partial<BimManualAlignment>) => void;
  onReset: () => void;
  /** Tighter chrome when nested in the combined-mode left rail. */
  density?: "default" | "compact";
};

function NumField({
  id,
  label,
  hint,
  value,
  onChange,
  step,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[length:var(--text-2xs)] font-bold text-[color:var(--text-muted)]">
        {label}
      </label>
      <p className="mt-0.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-subtle)]">{hint}</p>
      <Input
        id={id}
        type="number"
        step={step ?? "any"}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="mt-1 !h-7 !py-0 !text-[length:var(--text-xs)]"
      />
    </div>
  );
}

/**
 * Combined-mode MVP: nudge the BIM model in the 3D viewer so it roughly lines up with the map by eye.
 */
export default function BimManualAlignmentPanel({
  value,
  onChange,
  onReset,
  density = "default",
}: BimManualAlignmentPanelProps) {
  const compact = density === "compact";
  return (
    <Card
      className={[
        "border-[color:var(--border)] shadow-[var(--shadow-xs)]",
        compact ? "p-[length:var(--panel-padding-compact)]" : "p-[length:var(--card-padding)]",
      ].join(" ")}
    >
      <p className="label-eyebrow">Manual BIM alignment</p>
      <p
        className={[
          "mt-1 leading-relaxed text-[color:var(--text-muted)]",
          "text-[length:var(--text-2xs)]",
        ].join(" ")}
      >
        The map uses real-world coordinates; the building model often lives in its own numbers. These sliders move and
        spin         the <span className="font-medium text-[color:var(--text)]">whole BIM</span> in the 3D view only — they do not
        change the map. Use them to line things up by eye until real georeferencing exists.
      </p>
      <Divider className="my-[length:var(--space-2)]" />
      <div
        className={
          compact
            ? "grid grid-cols-1 gap-[length:var(--layout-inline-gap)]"
            : "grid grid-cols-1 gap-[length:var(--layout-section-gap)]"
        }
      >
        <NumField
          id="bim-align-x"
          label="X offset"
          hint="Slides the model along one horizontal axis in the 3D scene."
          value={value.offsetX}
          onChange={(n) => onChange({ offsetX: n })}
        />
        <NumField
          id="bim-align-y"
          label="Y offset"
          hint="Slides the model up or down (height in the 3D scene)."
          value={value.offsetY}
          onChange={(n) => onChange({ offsetY: n })}
        />
        <NumField
          id="bim-align-z"
          label="Z offset"
          hint="Slides the model along the other horizontal axis in the 3D scene."
          value={value.offsetZ}
          onChange={(n) => onChange({ offsetZ: n })}
        />
        <NumField
          id="bim-align-rot"
          label="Rotation (degrees)"
          hint="Turns the model around the vertical axis, like spinning a model on a desk."
          value={value.rotationYDeg}
          step="1"
          onChange={(n) => onChange({ rotationYDeg: n })}
        />
        <NumField
          id="bim-align-scale"
          label="Scale"
          hint="1 = normal size. Larger values make the whole building bigger in 3D (does not affect the map)."
          value={value.uniformScale}
          step="0.1"
          onChange={(n) => onChange({ uniformScale: n > 0 ? n : 0.001 })}
        />
      </div>
      <Divider className="my-2" />
      <p className="text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-muted)]">
        Current values
      </p>
      <dl className="mt-1 grid grid-cols-[72px_1fr] gap-x-2 gap-y-0.5 font-mono text-[length:var(--text-2xs)] text-[color:var(--text)]">
        <dt className="text-[color:var(--text-muted)]">X</dt>
        <dd>{value.offsetX}</dd>
        <dt className="text-[color:var(--text-muted)]">Y</dt>
        <dd>{value.offsetY}</dd>
        <dt className="text-[color:var(--text-muted)]">Z</dt>
        <dd>{value.offsetZ}</dd>
        <dt className="text-[color:var(--text-muted)]">Rot Y°</dt>
        <dd>{value.rotationYDeg}</dd>
        <dt className="text-[color:var(--text-muted)]">Scale</dt>
        <dd>{value.uniformScale}</dd>
      </dl>
      <Button type="button" variant="secondary" size="sm" className="mt-2 w-full" onClick={onReset}>
        Reset alignment
      </Button>
      <p className="mt-1.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-subtle)]">
        Stored in memory only for this session (lost on full page reload unless you add persistence later).
      </p>
    </Card>
  );
}
