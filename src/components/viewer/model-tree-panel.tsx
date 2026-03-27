"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { ElementItem, TreeGroup } from "@/features/viewer/types";

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
        <mark className="rounded bg-amber-100 px-0.5 text-slate-900">
          {text.slice(startIndex, endIndex)}
        </mark>
        {text.slice(endIndex)}
      </>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Model Tree
      </p>
      <input
        type="text"
        value={treeSearch}
        onChange={(event) => setTreeSearch(event.target.value)}
        placeholder="Search element, category, level..."
        className="mt-3 w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
      />

      <div className="mt-3 space-y-2 text-sm" tabIndex={0} onKeyDown={handleTreeKeyDown}>
        {filteredModelTree.map((levelGroup) => (
          <div key={levelGroup.level} className="rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => toggleLevel(levelGroup.level)}
              className="flex w-full items-center justify-between px-2.5 py-2 text-left font-medium text-slate-800"
            >
              <span>{highlightMatch(levelGroup.level)}</span>
              <span className="text-xs text-slate-500">{openLevels[levelGroup.level] ? "-" : "+"}</span>
            </button>

            {openLevels[levelGroup.level] && (
              <div className="space-y-1 border-t border-slate-100 p-2">
                {levelGroup.categories.map((categoryGroup) => {
                  const categoryKey = `${levelGroup.level}::${categoryGroup.name}`;
                  const isCategoryOpen = !!openCategories[categoryKey];

                  return (
                    <div key={categoryKey} className="rounded-md">
                      <button
                        type="button"
                        onClick={() => toggleCategory(levelGroup.level, categoryGroup.name)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-slate-700 hover:bg-slate-50"
                      >
                        <span>{highlightMatch(categoryGroup.name)}</span>
                        <span className="text-xs text-slate-500">{isCategoryOpen ? "-" : "+"}</span>
                      </button>

                      {isCategoryOpen && (
                        <div className="mt-1 space-y-1 pl-2">
                          {categoryGroup.elements.map((element) => (
                            <button
                              key={element.id}
                              type="button"
                              onClick={() => onSelectElement(element.id)}
                              className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition ${
                                selectedElementId === element.id
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
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
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-xs text-slate-500">
            No matching elements found.
          </div>
        )}

        <p className="pt-1 text-[11px] text-slate-400">
          Keyboard: Arrow Up/Down to move selection, Enter to confirm.
        </p>
      </div>
    </div>
  );
}
