"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useId,
  ChangeEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

type Align = "left" | "right" | "center";

export interface ColumnDef<TRow extends RowData = RowData> {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  align?: Align;
  headerAlign?: Align;
  sortable?: boolean;
  hidden?: boolean;
  columnSeparator?: boolean;
  skeletonWidth?: string;
  renderCell?: (row: TRow) => React.ReactNode;
  csvValue?: (row: TRow) => unknown;
  searchValue?: (row: TRow) => unknown;
  sortValue?: (row: TRow) => unknown;
  cellClassName?: (row: TRow) => string | undefined;
  onCellClick?: (row: TRow) => void;
}

export interface SortState {
  field: string;
  dir: "asc" | "desc";
}

export interface GridProps<TRow extends RowData = RowData> {
  rows?: TRow[];
  columns?: ColumnDef<TRow>[];
  storageKey?: string;
  selectedRows?: (string | number)[];
  onSelectedRowsChange?: (ids: (string | number)[]) => void;
  onRowClick?: (row: TRow) => void;
  loading?: boolean;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  exportFilename?: string;
  columnToggleable?: boolean;
  stickyHeader?: boolean;
  page?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  sortField?: string | null;
  sortDir?: "asc" | "desc";
  onSortChange?: (sort: SortState) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters?: React.ReactNode;
}

// ════════════════════════════════════════════════════════════════════════════
// Small utils
// ════════════════════════════════════════════════════════════════════════════

const cx = (...args: (string | false | null | undefined)[]): string =>
  args.filter(Boolean).join(" ");

const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

const getValue = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / SSR */
    }
  },
};

const exportCSV = <TRow extends RowData>(
  rows: TRow[],
  columns: ColumnDef<TRow>[],
  filename = "export.csv",
): void => {
  const cols = columns.filter((c) => !c.hidden);
  const header = cols.map((c) => JSON.stringify(c.headerName)).join(",");
  const body = rows.map((row) =>
    cols
      .map((c) => {
        const val = c.csvValue ? c.csvValue(row) : getValue(row, c.field);
        return JSON.stringify(String(val));
      })
      .join(","),
  );
  const blob = new Blob([[header, ...body].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ════════════════════════════════════════════════════════════════════════════
// Presentational subcomponents
// ════════════════════════════════════════════════════════════════════════════

const SkeletonRows = <TRow extends RowData = RowData>({
  columns,
  pageSize = 10,
  selectable = false,
}: {
  columns: ColumnDef<TRow>[];
  pageSize?: number;
  selectable?: boolean;
}) => (
  <>
    {Array.from({ length: pageSize }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        role="row"
        aria-hidden="true"
        className="!border-b border-gray-100"
      >
        {selectable && (
          <td className="!px-3 !py-3 sm:!px-4 sm:!py-4 md:!px-6">
            <div className="h-4 w-4 rounded bg-gray-200" />
          </td>
        )}
        {columns.map((col, colIndex) => (
          <td
            key={col.field}
            className="!px-3 !py-3 sm:!px-4 sm:!py-4 md:!px-6"
          >
            <div
              className="h-4 rounded-md bg-gray-200"
              style={{
                width:
                  col.skeletonWidth ??
                  ["90%", "70%", "55%", "80%"][colIndex % 4],
              }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

interface IndeterminateCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  label?: string;
}

const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  checked,
  indeterminate,
  label,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={label}
      className="w-[18px] h-[18px] sm:w-4 sm:h-4 rounded cursor-pointer"
      {...props}
    />
  );
};

const SortIcon: React.FC<{ active: boolean; dir: "asc" | "desc" }> = ({
  active,
  dir,
}) => (
  <span className="inline-flex flex-col ml-1 leading-none" aria-hidden="true">
    <span
      className={cx(
        "text-[10px] leading-none",
        !(active && dir === "asc") && "opacity-30",
      )}
    >
      ▲
    </span>
    <span
      className={cx(
        "text-[10px] leading-none",
        !(active && dir === "desc") && "opacity-30",
      )}
    >
      ▼
    </span>
  </span>
);

const VisibilityPanel: React.FC<{
  columns: ColumnDef[];
  hidden: string[];
  onToggle: (field: string) => void;
  onClose: () => void;
}> = ({ columns, hidden, onToggle, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Column visibility"
      className="absolute right-0 top-full mt-1 z-30 rounded-lg shadow-lg border border-gray-200 bg-white p-3 w-[min(13rem,calc(100vw-2rem))]"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Columns
      </p>
      {columns.map((col) => (
        <label
          key={col.field}
          className="flex items-center gap-2 py-1.5 sm:py-1 px-1 rounded cursor-pointer hover:bg-gray-50"
        >
          <input
            type="checkbox"
            className="w-[18px] h-[18px] sm:w-4 sm:h-4 rounded cursor-pointer"
            checked={!hidden.includes(col.field)}
            onChange={() => onToggle(col.field)}
          />
          <span className="text-sm text-gray-700">{col.headerName}</span>
        </label>
      ))}
    </div>
  );
};

const Toolbar: React.FC<{
  searchable: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  exportable: boolean;
  onExport: () => void;
  columnToggleable: boolean;
  columns: ColumnDef[];
  hiddenColumns: string[];
  onToggleColumn: (field: string) => void;
  tableId: string;
  filters?: React.ReactNode;
}> = ({
  searchable,
  searchQuery,
  onSearchChange,
  exportable,
  onExport,
  columnToggleable,
  columns,
  hiddenColumns,
  onToggleColumn,
  tableId,
  filters,
}) => {
  const [showCols, setShowCols] = useState(false);
  const inputId = useId();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
      {(filters || searchable) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          {filters && <div>{filters}</div>}

          {searchable && (
            <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-xs">
              <label htmlFor={inputId} className="sr-only">
                Search
              </label>
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                aria-hidden="true"
              >
                🔍
              </span>
              <input
                id={inputId}
                type="search"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(e.target.value)
                }
                placeholder="Search…"
                aria-controls={tableId}
                className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 sm:ml-auto sm:shrink-0 relative">
        {exportable && (
          <button
            onClick={onExport}
            aria-label="Export as CSV"
            className="px-2.5 py-2 sm:px-3 sm:py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <span aria-hidden="true">↓</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}
        {columnToggleable && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowCols((v) => !v)}
              aria-label="Toggle column visibility"
              className="px-2.5 py-2 sm:px-3 sm:py-1.5 text-sm transition flex items-center gap-1.5"
            >
              <span aria-hidden="true">⊞</span>
              <span className="hidden sm:inline">Columns</span>
              {hiddenColumns.length > 0 && (
                <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {hiddenColumns.length}
                </span>
              )}
            </button>
            {showCols && (
              <div className="absolute right-0 top-full mt-1 z-20 w-[calc(100vw-1.5rem)] max-w-xs sm:w-64">
                <VisibilityPanel
                  columns={columns}
                  hidden={hiddenColumns}
                  onToggle={onToggleColumn}
                  onClose={() => setShowCols(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// Hooks — controllable (controlled/uncontrolled) state
// ════════════════════════════════════════════════════════════════════════════

/**
 * Resolves a piece of state that may be either controlled by a parent
 * (via `controlledValue` + a change callback) or managed internally.
 * Returns the effective value plus a setter that only affects internal state
 * (callers are responsible for invoking the external callback themselves when
 * the state is controlled).
 */
function useControllableState<T>(
  isControlled: boolean,
  controlledValue: T | undefined,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? (controlledValue as T) : internalValue;
  return [value, setInternalValue];
}

// ════════════════════════════════════════════════════════════════════════════
// Hooks — column order / resize / visibility
// ════════════════════════════════════════════════════════════════════════════

function useColumnOrder<TRow extends RowData>(
  columns: ColumnDef<TRow>[],
  storageKey?: string,
) {
  const defaultOrder = useMemo(() => columns.map((c) => c.field), [columns]);

  const [colOrder, setColOrder] = useState<string[]>(() =>
    storageKey
      ? storage.get<string[]>(`${storageKey}-col-order`, defaultOrder)
      : defaultOrder,
  );

  // Only re-sync when the *set* of available fields changes (columns added
  // or removed), not when column objects are re-created or reordered by the
  // parent. A sorted signature avoids the eslint-disable this used to need.
  const columnFieldsSignature = useMemo(
    () => [...defaultOrder].sort().join("|"),
    [defaultOrder],
  );

  useEffect(() => {
    setTimeout(() => {
      setColOrder((prev) => {
        const prevSet = new Set(prev);
        const additions = defaultOrder.filter((f) => !prevSet.has(f));
        const pruned = prev.filter((f) => defaultOrder.includes(f));
        return [...pruned, ...additions];
      });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFieldsSignature]);

  const reorder = useCallback(
    (fromField: string, toField: string) => {
      if (fromField === toField) return;
      setColOrder((prev) => {
        const next = [...prev];
        const fromIndex = next.indexOf(fromField);
        const toIndex = next.indexOf(toField);
        if (fromIndex === -1 || toIndex === -1) return prev;
        next.splice(fromIndex, 1);
        next.splice(toIndex, 0, fromField);
        if (storageKey) storage.set(`${storageKey}-col-order`, next);
        return next;
      });
    },
    [storageKey],
  );

  const orderedColumns = useMemo<ColumnDef<TRow>[]>(() => {
    const byField = Object.fromEntries(columns.map((c) => [c.field, c]));
    return colOrder.map((f) => byField[f]).filter(Boolean) as ColumnDef<TRow>[];
  }, [columns, colOrder]);

  return { orderedColumns, reorder };
}

function useColumnResize(columns: ColumnDef[]) {
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const startResize = useCallback(
    (
      e: ReactPointerEvent<HTMLSpanElement>,
      field: string,
      currentWidth: number,
    ) => {
      e.preventDefault();
      const el = e.currentTarget;
      const startX = e.clientX;
      const startWidth = currentWidth;
      const minWidth = columns.find((c) => c.field === field)?.minWidth ?? 60;

      el.setPointerCapture(e.pointerId);

      const onMove = (moveEvent: PointerEvent) => {
        const next = Math.max(
          minWidth,
          startWidth + moveEvent.clientX - startX,
        );
        setColWidths((prev) => ({ ...prev, [field]: next }));
      };
      const onUp = () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
    },
    [columns],
  );

  return { colWidths, startResize };
}

function useColumnVisibility(storageKey?: string) {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() =>
    storageKey ? storage.get<string[]>(`${storageKey}-hidden-cols`, []) : [],
  );

  const toggleColumn = useCallback(
    (field: string) => {
      setHiddenColumns((prev) => {
        const next = prev.includes(field)
          ? prev.filter((f) => f !== field)
          : [...prev, field];
        if (storageKey) storage.set(`${storageKey}-hidden-cols`, next);
        return next;
      });
    },
    [storageKey],
  );

  return { hiddenColumns, toggleColumn };
}

/** Drag-to-reorder for header cells, sharing a single "currently dragged" ref. */
function useHeaderDragReorder(reorder: (from: string, to: string) => void) {
  const dragSrc = useRef<string | null>(null);

  const onPointerDown = useCallback(
    (field: string) => (e: ReactPointerEvent<HTMLTableCellElement>) => {
      if (e.button !== 0) return;
      dragSrc.current = field;
    },
    [],
  );

  const onPointerUp = useCallback(
    (field: string) => () => {
      if (dragSrc.current && dragSrc.current !== field) {
        reorder(dragSrc.current, field);
      }
      dragSrc.current = null;
    },
    [reorder],
  );

  const onPointerEnter = useCallback(
    (field: string) => () => {
      if (dragSrc.current && dragSrc.current !== field) {
        reorder(dragSrc.current, field);
        dragSrc.current = field;
      }
    },
    [reorder],
  );

  return { onPointerDown, onPointerUp, onPointerEnter };
}

// ════════════════════════════════════════════════════════════════════════════
// Hooks — search / sort / pagination pipeline
// ════════════════════════════════════════════════════════════════════════════

interface UseGridPipelineArgs<TRow extends RowData> {
  rows: TRow[];
  visibleColumns: ColumnDef<TRow>[];
  pageSize: number;
  isServerSearch: boolean;
  isServerSort: boolean;
  isServerPagination: boolean;
  searchQuery: string;
  sortField: string | null | undefined;
  sortDir: "asc" | "desc";
  page: number;
  totalRows?: number;
}

/**
 * Pure(ish) pipeline: filters -> sorts -> paginates. When search/sort/paging
 * are server-controlled, the corresponding step is skipped locally because
 * the parent is assumed to have already applied it to `rows`.
 */
function useGridPipeline<TRow extends RowData>({
  rows,
  visibleColumns,
  pageSize,
  isServerSearch,
  isServerSort,
  isServerPagination,
  searchQuery,
  sortField,
  sortDir,
  page,
  totalRows,
}: UseGridPipelineArgs<TRow>) {
  const searchedRows = useMemo<TRow[]>(() => {
    if (isServerSearch || !searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) =>
      visibleColumns.some((col) => {
        const val = col.searchValue
          ? col.searchValue(row)
          : getValue(row, col.field);
        return String(val).toLowerCase().includes(q);
      }),
    );
  }, [rows, visibleColumns, searchQuery, isServerSearch]);

  const sortedRows = useMemo<TRow[]>(() => {
    if (isServerSort || !sortField) return searchedRows;
    const col = visibleColumns.find((c) => c.field === sortField);
    return [...searchedRows].sort((a, b) => {
      const av = col?.sortValue ? col.sortValue(a) : getValue(a, sortField);
      const bv = col?.sortValue ? col.sortValue(b) : getValue(b, sortField);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searchedRows, visibleColumns, sortField, sortDir, isServerSort]);

  const effectiveTotalRows = isServerPagination
    ? (totalRows ?? 0)
    : sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalRows / pageSize));

  const pagedRows = isServerPagination
    ? rows
    : sortedRows.slice((page - 1) * pageSize, page * pageSize);

  return { sortedRows, pagedRows, effectiveTotalRows, totalPages };
}

// ════════════════════════════════════════════════════════════════════════════
// Hooks — row selection
// ════════════════════════════════════════════════════════════════════════════

function useRowSelection<TRow extends RowData>(
  pagedRows: TRow[],
  selectedRows: (string | number)[] | undefined,
  onSelectedRowsChange: ((ids: (string | number)[]) => void) | undefined,
) {
  const isSelectable =
    Array.isArray(selectedRows) && typeof onSelectedRowsChange === "function";

  const selected = isSelectable ? selectedRows! : [];
  const pageIds = useMemo(() => pagedRows.map((r) => r.id), [pagedRows]);
  const selectedOnPage = pageIds.filter((id) => selected.includes(id));
  const allOnPageSelected =
    pagedRows.length > 0 && selectedOnPage.length === pageIds.length;
  const someOnPageSelected = selectedOnPage.length > 0 && !allOnPageSelected;

  const updateSelected = useCallback(
    (
      updater:
        | ((prev: (string | number)[]) => (string | number)[])
        | (string | number)[],
    ) => {
      if (!isSelectable) return;
      const next = typeof updater === "function" ? updater(selected) : updater;
      onSelectedRowsChange!(next);
    },
    [selected, isSelectable, onSelectedRowsChange],
  );

  const selectAllOnPage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        updateSelected((prev) => [...new Set([...prev, ...pageIds])]);
      } else {
        updateSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
      }
    },
    [pageIds, updateSelected],
  );

  const toggleRow = useCallback(
    (id: string | number) => {
      updateSelected((prev) =>
        prev.includes(id)
          ? prev.filter((existing) => existing !== id)
          : [...prev, id],
      );
    },
    [updateSelected],
  );

  return {
    isSelectable,
    selected,
    allOnPageSelected,
    someOnPageSelected,
    selectAllOnPage,
    toggleRow,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Grid
// ════════════════════════════════════════════════════════════════════════════

function Grid<TRow extends RowData = RowData>({
  rows = [],
  columns = [],
  storageKey,
  filters,
  selectedRows,
  onSelectedRowsChange,
  onRowClick,
  loading = false,
  pageSize = 8,
  searchable = false,
  exportable = false,
  exportFilename = "export.csv",
  columnToggleable = false,
  stickyHeader = false,
  page: controlledPage,
  totalRows,
  onPageChange,
  sortField: controlledSortField,
  sortDir: controlledSortDir,
  onSortChange,
  searchQuery: controlledSearch,
  onSearchChange: onSearchChangeProp,
}: GridProps<TRow>): React.ReactElement {
  const tableId = useId();

  const isServerPagination = typeof onPageChange === "function";
  const isServerSort = typeof onSortChange === "function";
  const isServerSearch = typeof onSearchChangeProp === "function";

  // ── Columns: order, resize, visibility ──────────────────────────────────
  const { orderedColumns, reorder } = useColumnOrder<TRow>(columns, storageKey);
  const { colWidths, startResize } = useColumnResize(
    orderedColumns as ColumnDef[],
  );
  const { hiddenColumns, toggleColumn } = useColumnVisibility(storageKey);
  const headerDrag = useHeaderDragReorder(reorder);

  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => !hiddenColumns.includes(c.field)),
    [orderedColumns, hiddenColumns],
  );

  // ── Search ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useControllableState(
    isServerSearch,
    controlledSearch,
    "",
  );
  const handleSearchChange = useCallback(
    (q: string) => {
      if (isServerSearch) {
        onSearchChangeProp!(q);
      } else {
        setSearchQuery(q);
        setPage(1);
      }
    },
    // setPage defined below; safe because it's stable across renders in both branches
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isServerSearch, onSearchChangeProp, setSearchQuery],
  );

  // ── Pagination ────────────────────────────────────────────────────────
  const [page, setPage] = useControllableState(
    isServerPagination,
    controlledPage,
    1,
  );
  const setPageResolved = isServerPagination ? onPageChange! : setPage;

  // ── Sort ──────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useControllableState<string | null>(
    isServerSort,
    controlledSortField,
    null,
  );
  const [sortDir, setSortDir] = useControllableState(
    isServerSort,
    controlledSortDir,
    "asc" as "asc" | "desc",
  );
  const handleSort = useCallback(
    (field: string) => {
      if (isServerSort) {
        const nextDir: "asc" | "desc" =
          sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";
        onSortChange!({ field, dir: nextDir });
      } else if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [isServerSort, sortField, sortDir, onSortChange, setSortField, setSortDir],
  );

  // ── Data pipeline: search -> sort -> paginate ────────────────────────
  const { sortedRows, pagedRows, effectiveTotalRows, totalPages } =
    useGridPipeline({
      rows,
      visibleColumns,
      pageSize,
      isServerSearch,
      isServerSort,
      isServerPagination,
      searchQuery,
      sortField,
      sortDir,
      page,
      totalRows,
    });

  // Clamp the page if it now exceeds the available pages (e.g. after a
  // search narrows the result set). Deferred to avoid updating state
  // synchronously during another component's render/effect phase.
  useEffect(() => {
    if (!isServerPagination && page > totalPages) {
      setTimeout(() => setPage(totalPages), 0);
    }
  }, [page, totalPages, isServerPagination, setPage]);

  // ── Selection ─────────────────────────────────────────────────────────
  const {
    isSelectable,
    selected,
    allOnPageSelected,
    someOnPageSelected,
    selectAllOnPage,
    toggleRow,
  } = useRowSelection(pagedRows, selectedRows, onSelectedRowsChange);

  const renderCell = (row: TRow, col: ColumnDef<TRow>): React.ReactNode => {
    if (col.renderCell) return col.renderCell(row);
    return (getValue(row, col.field) ?? "—") as React.ReactNode;
  };

  const ariaSort = (field: string): React.AriaAttributes["aria-sort"] => {
    if (sortField !== field) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <Toolbar
        searchable={searchable}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        exportable={exportable}
        onExport={() =>
          exportCSV(sortedRows, visibleColumns as ColumnDef[], exportFilename)
        }
        columnToggleable={columnToggleable}
        columns={orderedColumns as ColumnDef[]}
        hiddenColumns={hiddenColumns}
        onToggleColumn={toggleColumn}
        tableId={tableId}
        filters={filters}
      />

      <div className="overflow-x-auto shadow-sm">
        <table
          id={tableId}
          role="grid"
          aria-label="Data grid"
          aria-rowcount={effectiveTotalRows}
          className="w-full border-collapse"
        >
          <thead className={cx(stickyHeader && "sticky top-0 z-20")}>
            <tr role="row" className="bg-gray-100">
              {isSelectable && (
                <th
                  role="columnheader"
                  scope="col"
                  className="!px-3 sm:!px-6 text-left w-10 bg-gray-100"
                >
                  <IndeterminateCheckbox
                    checked={allOnPageSelected}
                    indeterminate={someOnPageSelected}
                    label="Select all rows on this page"
                    onChange={selectAllOnPage}
                    disabled={loading}
                  />
                </th>
              )}

              {visibleColumns.map((col) => {
                const width = colWidths[col.field] ?? col.width;
                const isSorted = sortField === col.field;
                const headerAlign = col.headerAlign ?? col.align ?? "left";
                return (
                  <th
                    key={col.field}
                    role="columnheader"
                    scope="col"
                    aria-sort={col.sortable ? ariaSort(col.field) : undefined}
                    className={cx(
                      "relative text-xs sm:text-sm font-semibold select-none bg-gray-100 !px-3 !py-2.5 sm:!px-4 sm:!py-3 md:!px-6",
                      ALIGN[headerAlign],
                      col.sortable &&
                        "cursor-pointer hover:bg-gray-200 transition-colors",
                    )}
                    style={{ width }}
                    onClick={
                      col.sortable ? () => handleSort(col.field) : undefined
                    }
                    onPointerDown={headerDrag.onPointerDown(col.field)}
                    onPointerUp={headerDrag.onPointerUp(col.field)}
                    onPointerEnter={headerDrag.onPointerEnter(col.field)}
                  >
                    <span
                      className={cx(
                        "flex items-center gap-0.5 pr-2 sm:pr-3",
                        headerAlign === "left" && "justify-start",
                        headerAlign === "center" && "justify-center",
                        headerAlign === "right" && "justify-end",
                      )}
                    >
                      {col.headerName}
                      {col.sortable && (
                        <SortIcon active={isSorted} dir={sortDir} />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows
                columns={visibleColumns as ColumnDef[]}
                pageSize={pageSize}
                selectable={isSelectable}
              />
            ) : pagedRows.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={visibleColumns.length + (isSelectable ? 1 : 0)}
                  className="!px-3 sm:!px-6 text-center text-sm text-gray-400"
                  style={{ height: "200px" }}
                >
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No records found"}
                </td>
              </tr>
            ) : (
              pagedRows.map((row, rowIdx) => (
                <tr
                  key={row.id}
                  role="row"
                  aria-rowindex={(page - 1) * pageSize + rowIdx + 2}
                  aria-selected={
                    isSelectable ? selected.includes(row.id) : undefined
                  }
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cx(onRowClick && "cursor-pointer")}
                >
                  {isSelectable && (
                    <td
                      role="gridcell"
                      className="!p-3 sm:!p-4 md:!p-6 w-16 sm:w-20"
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.id}`}
                        className="w-[18px] h-[18px] sm:w-4 sm:h-4 rounded cursor-pointer"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                  )}

                  {visibleColumns.map((col) => {
                    const width = colWidths[col.field] ?? col.width;
                    return (
                      <td
                        key={`${row.id}-${col.field}`}
                        role="gridcell"
                        className={cx(
                          "text-xs sm:text-sm !px-3 !py-2.5 sm:!px-4 sm:!py-3 md:!px-6",
                          ALIGN[col.align ?? "left"],
                          col.cellClassName?.(row),
                          col.onCellClick && "cursor-pointer hover:underline",
                        )}
                        style={{ width }}
                        onClick={
                          col.onCellClick
                            ? (e: MouseEvent) => {
                                e.stopPropagation();
                                col.onCellClick!(row);
                              }
                            : undefined
                        }
                      >
                        {renderCell(row, col)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex mt-2 text-typography-secondary border-t-0 items-center justify-between px-3 py-3 sm:px-5 flex-wrap gap-2">
        <span
          className="text-xs sm:text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {isSelectable && selected.length > 0
            ? `${selected.length} of ${effectiveTotalRows} selected`
            : `${effectiveTotalRows} records`}
        </span>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="px-3 py-2 sm:py-1 text-xs sm:text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPageResolved(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm" aria-live="polite">
            Page {page} of {totalPages}
          </span>

          <button
            aria-label="Next page"
            className="px-3 py-2 sm:py-1 text-xs sm:text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPageResolved(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Grid;
