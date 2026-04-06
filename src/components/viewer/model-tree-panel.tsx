"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { ElementItem, TreeGroup } from "@/features/viewer/types";
import { Input } from "@/components/ui";

type ModelTreePanelProps = {
  elements: ElementItem[];
  selectedElementId: string;
  onSelectElement: (id: string) => void;
};

export default function ModelTreePanel({
  elements,
  selectedElementId,
  onSelectElement,
}: ModelTreePanelProps) {
  const [treeSearch, setTreeSearch] = useState("");
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    "Level 01": true,
    "Level 02": true,
    "Level 03": false,
    "Level 04": false,
  });
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Level 01::Door": true,
    "Level 02::Wall": true,
  });

  const modelTree = useMemo<TreeGroup[]>(() => {
    const levelMap = new Map<string, Map<string, ElementItem[]>>();

    for (const element of elements) {
      if (!levelMap.has(element.level)) {
        levelMap.set(element.level, new Map<string, ElementItem[]>());
      }
      const categoryMap = levelMap.get(element.level);
      if (!categoryMap) continue;
      if (!categoryMap.has(element.category)) {
        categoryMap.set(element.category, []);
      }
      const categoryElements = categoryMap.get(element.category);
      if (!categoryElements) continue;
      categoryElements.push(element);
    }

    return Array.from(levelMap.entries()).map(([level, categoryMap]) => ({
      level,
      categories: Array.from(categoryMap.entries()).map(([name, groupElements]) => ({
        name,
        elements: groupElements,
      })),
    }));
  }, [elements]);

  const filteredModelTree = useMemo<TreeGroup[]>(() => {
    const query = treeSearch.trim().toLowerCase();
    if (!query) return modelTree;

    return modelTree
      .map((levelGroup) => ({
        ...levelGroup,
        categories: levelGroup.categories
          .map((categoryGroup) => ({
            ...categoryGroup,
            elements: categoryGroup.elements.filter((element) =>
              [element.id, element.category, element.type, element.level]
                .join(" ")
                .toLowerCase()
                .includes(query),
            ),
          }))
          .filter((categoryGroup) => categoryGroup.elements.length > 0),
      }))
      .filter((levelGroup) => levelGroup.categories.length > 0);
  }, [modelTree, treeSearch]);

  const visibleElements = useMemo(() => {
    const items: ElementItem[] = [];
    for (const levelGroup of filteredModelTree) {
      if (!openLevels[levelGroup.level]) continue;
      for (const categoryGroup of levelGroup.categories) {
        const categoryKey = `${levelGroup.level}::${categoryGroup.name}`;
        if (!openCategories[categoryKey]) continue;
        items.push(...categoryGroup.elements);
      }
    }
    return items;
  }, [filteredModelTree, openCategories, openLevels]);

  function toggleLevel(level: string) {
    setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  }

  function toggleCategory(level: string, category: string) {
    const key = `${level}::${category}`;
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function moveSelection(step: number) {
    if (visibleElements.length === 0) return;
    const currentIndex = visibleElements.findIndex((item) => item.id === selectedElementId);
    if (currentIndex < 0) {
      onSelectElement(visibleElements[0].id);
      return;
    }
    const nextIndex = Math.max(0, Math.min(visibleElements.length - 1, currentIndex + step));
    onSelectElement(visibleElements[nextIndex].id);
  }

  function handleTreeKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!visibleElements.some((item) => item.id === selectedElementId) && visibleElements.length > 0) {
        onSelectElement(visibleElements[0].id);
      }
    }
  }

  function highlightMatch(text: string) {
    const query = treeSearch.trim();
    if (!query) return text;
    const source = text.toLowerCase();
    const needle = query.toLowerCase();
    const startIndex = source.indexOf(needle);
    if (startIndex < 0) return text;
    const endIndex = startIndex + needle.length;

    return (
      <>
        {text.slice(0, startIndex)}
        <mark className="rounded-[var(--radius-xs)] bg-[color:var(--primary-100)] px-0.5 font-semibold text-[color:var(--text)]">
          {text.slice(startIndex, endIndex)}
        </mark>
        {text.slice(endIndex)}
      </>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-2.5 shadow-[var(--shadow-xs)]">
      <p className="label-eyebrow">Model tree</p>
      <p className="mt-1 text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">Hierarchy placeholder</p>
      <Input
        type="text"
        value={treeSearch}
        onChange={(event) => setTreeSearch(event.target.value)}
        placeholder="Search element, category, level..."
        aria-label="Filter model tree"
        className="mt-2"
      />

      <div className="mt-2 space-y-1.5 text-[length:var(--text-xs)]" tabIndex={0} onKeyDown={handleTreeKeyDown}>
        {filteredModelTree.map((levelGroup) => (
          <div key={levelGroup.level} className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)]">
            <button
              type="button"
              onClick={() => toggleLevel(levelGroup.level)}
              className="interactive-tree-header ui-focus-ring flex w-full cursor-pointer items-center justify-between rounded-t-[calc(var(--radius-md)-1px)] px-2 py-1.5 text-left text-[length:var(--text-xs)] font-bold text-[color:var(--text)] focus-visible:outline-none"
            >
              <span>{highlightMatch(levelGroup.level)}</span>
              <span className="text-[length:var(--text-xs)] text-[color:var(--text-muted)]">{openLevels[levelGroup.level] ? "-" : "+"}</span>
            </button>

            {openLevels[levelGroup.level] && (
              <div className="space-y-1 border-t border-[color:var(--border-subtle)] p-1.5">
                {levelGroup.categories.map((categoryGroup) => {
                  const categoryKey = `${levelGroup.level}::${categoryGroup.name}`;
                  const isCategoryOpen = !!openCategories[categoryKey];

                  return (
                    <div key={categoryKey} className="rounded-md">
                      <button
                        type="button"
                        onClick={() => toggleCategory(levelGroup.level, categoryGroup.name)}
                        className="interactive-tree-header ui-focus-ring flex w-full cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-1.5 py-1 text-left text-[length:var(--text-xs)] font-semibold text-[color:var(--text-muted)] focus-visible:outline-none"
                      >
                        <span>{highlightMatch(categoryGroup.name)}</span>
                        <span className="text-[length:var(--text-xs)] text-[color:var(--text-subtle)]">{isCategoryOpen ? "-" : "+"}</span>
                      </button>

                      {isCategoryOpen && (
                        <div className="mt-1 space-y-1 pl-1.5">
                          {categoryGroup.elements.map((element) => (
                            <button
                              key={element.id}
                              type="button"
                              onClick={() => onSelectElement(element.id)}
                              aria-current={selectedElementId === element.id ? "true" : undefined}
                              className={[
                                "ui-focus-ring w-full cursor-pointer rounded-[var(--radius-sm)] px-1.5 py-1 text-left text-[length:var(--text-xs)] transition-[color,background-color,border-color,box-shadow,transform] focus-visible:outline-none active:scale-[0.99]",
                                selectedElementId === element.id
                                  ? "list-item-selected"
                                  : "border border-transparent text-[color:var(--text-muted)] hover:border-[color:var(--border-subtle)] hover:bg-[color:color-mix(in_srgb,var(--primary-50)_28%,var(--surface-muted))] hover:text-[color:var(--text)]",
                              ].join(" ")}
                            >
                              {highlightMatch(`${element.id} - ${element.type}`)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {filteredModelTree.length === 0 && (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)] px-2.5 py-3 text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            No matching elements found.
          </div>
        )}

        <p className="pt-0.5 text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]">
          Keyboard: Arrow Up/Down to move selection, Enter to confirm.
        </p>
      </div>
    </div>
  );
}
