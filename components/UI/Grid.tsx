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

// ─── Utils ────────────────────────────────────────────────────────────────────

const cx = (...args: (string | false | null | undefined)[]): string =>
  args.filter(Boolean).join(" ");

const getValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

type Align = "left" | "right" | "center";
const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

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
  // Pass both to enable row selection UI
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
  // server pagination
  page?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  // server sort
  sortField?: string | null;
  sortDir?: "asc" | "desc";
  onSortChange?: (sort: SortState) => void;
  // server search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface SkeletonRowsProps<TRow extends RowData = RowData> {
  columns: ColumnDef<TRow>[];
  pageSize?: number;
  selectable?: boolean;
}

// ─── localStorage persistence ─────────────────────────────────────────────────

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

// ─── Export CSV ───────────────────────────────────────────────────────────────

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

// ─── Skeleton rows ────────────────────────────────────────────────────────────
const SkeletonRows = <TRow extends RowData = RowData>({
  columns,
  pageSize = 10,
  selectable = false,
}: SkeletonRowsProps<TRow>) => (
  <>
    {Array.from({ length: pageSize }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        role="row"
        aria-hidden="true"
        className="!border-b border-gray-100"
      >
        {selectable && (
          <td className="!px-6 !py-4">
            <div className="h-4 w-4 rounded bg-gray-200" />
          </td>
        )}

        {columns.map((col, colIndex) => (
          <td key={col.field} className="!px-6 !py-4">
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

// ─── Indeterminate checkbox ───────────────────────────────────────────────────

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
      className="w-4 h-4 rounded cursor-pointer"
      {...props}
    />
  );
};

// ─── Sort icon ────────────────────────────────────────────────────────────────

interface SortIconProps {
  active: boolean;
  dir: "asc" | "desc";
}

const SortIcon: React.FC<SortIconProps> = ({ active, dir }) => (
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

// ─── Column visibility panel ──────────────────────────────────────────────────

interface VisibilityPanelProps {
  columns: ColumnDef[];
  hidden: string[];
  onToggle: (field: string) => void;
  onClose: () => void;
}

const VisibilityPanel: React.FC<VisibilityPanelProps> = ({
  columns,
  hidden,
  onToggle,
  onClose,
}) => {
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
      className="absolute right-0 top-full mt-1 z-30 rounded-lg shadow-lg border border-gray-200 bg-white p-3 w-52"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Columns
      </p>
      {columns.map((col) => (
        <label
          key={col.field}
          className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-gray-50"
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded cursor-pointer"
            checked={!hidden.includes(col.field)}
            onChange={() => onToggle(col.field)}
          />
          <span className="text-sm text-gray-700">{col.headerName}</span>
        </label>
      ))}
    </div>
  );
};

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
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
}

const Toolbar: React.FC<ToolbarProps> = ({
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
}) => {
  const [showCols, setShowCols] = useState(false);
  const inputId = useId();

  return (
    <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
      {searchable && (
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <label htmlFor={inputId} className="sr-only">
            Search
          </label>
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
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
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto relative">
        {exportable && (
          <button
            onClick={onExport}
            aria-label="Export as CSV"
            className="px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5"
          >
            <span aria-hidden="true">↓</span> Export CSV
          </button>
        )}
        {columnToggleable && (
          <div className="relative">
            <button
              onClick={() => setShowCols((v) => !v)}
              aria-label="Toggle column visibility"
              className="px-3 py-1.5 text-sm transition flex items-center gap-1.5"
            >
              <span aria-hidden="true">⊞</span> Columns
              {hiddenColumns.length > 0 && (
                <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {hiddenColumns.length}
                </span>
              )}
            </button>
            {showCols && (
              <VisibilityPanel
                columns={columns}
                hidden={hiddenColumns}
                onToggle={onToggleColumn}
                onClose={() => setShowCols(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── useColumnResize ──────────────────────────────────────────────────────────

interface UseColumnResizeReturn {
  colWidths: Record<string, number>;
  startResize: (
    e: ReactPointerEvent<HTMLSpanElement>,
    field: string,
    currentWidth: number,
  ) => void;
}

const useColumnResize = (columns: ColumnDef[]): UseColumnResizeReturn => {
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
      const startW = currentWidth;
      const col = columns.find((c) => c.field === field);
      const minW = col?.minWidth ?? 60;

      el.setPointerCapture(e.pointerId);

      const onMove = (me: PointerEvent) => {
        const next = Math.max(minW, startW + me.clientX - startX);
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
};

// ─── useColumnOrder ───────────────────────────────────────────────────────────

interface UseColumnOrderReturn<TRow extends RowData> {
  orderedColumns: ColumnDef<TRow>[];
  reorder: (fromField: string, toField: string) => void;
}

const useColumnOrder = <TRow extends RowData>(
  columns: ColumnDef<TRow>[],
  storageKey?: string,
): UseColumnOrderReturn<TRow> => {
  const defaultOrder = columns.map((c) => c.field);

  const [colOrder, setColOrder] = useState<string[]>(() =>
    storageKey
      ? storage.get<string[]>(`${storageKey}-col-order`, defaultOrder)
      : defaultOrder,
  );

  useEffect(() => {
    setColOrder((prev) => {
      const prevSet = new Set(prev);
      const next = defaultOrder.filter((f) => !prevSet.has(f));
      const pruned = prev.filter((f) => defaultOrder.includes(f));
      return [...pruned, ...next];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length]);

  const reorder = useCallback(
    (fromField: string, toField: string) => {
      if (fromField === toField) return;
      setColOrder((prev) => {
        const next = [...prev];
        const fi = next.indexOf(fromField);
        const ti = next.indexOf(toField);
        if (fi === -1 || ti === -1) return prev;
        next.splice(fi, 1);
        next.splice(ti, 0, fromField);
        if (storageKey) storage.set(`${storageKey}-col-order`, next);
        return next;
      });
    },
    [storageKey],
  );

  const orderedColumns = useMemo<ColumnDef<TRow>[]>(() => {
    const map = Object.fromEntries(columns.map((c) => [c.field, c]));
    return colOrder.map((f) => map[f]).filter(Boolean) as ColumnDef<TRow>[];
  }, [columns, colOrder]);

  return { orderedColumns, reorder };
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

function Grid<TRow extends RowData = RowData>({
  rows = [],
  columns = [],
  storageKey,
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
  const isServerPagination = typeof onPageChange === "function";
  const isServerSort = typeof onSortChange === "function";
  const isServerSearch = typeof onSearchChangeProp === "function";

  // Selection is only enabled when BOTH selectedRows and onSelectedRowsChange are provided
  const isSelectable =
    Array.isArray(selectedRows) && typeof onSelectedRowsChange === "function";

  const tableId = useId();

  // ── Column order + resize ──────────────────────────────────────────────────
  const { orderedColumns, reorder } = useColumnOrder<TRow>(columns, storageKey);
  const { colWidths, startResize } = useColumnResize(
    orderedColumns as ColumnDef[],
  );

  // ── Column visibility ──────────────────────────────────────────────────────
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() =>
    storageKey ? storage.get<string[]>(`${storageKey}-hidden-cols`, []) : [],
  );

  const handleToggleColumn = useCallback(
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

  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => !hiddenColumns.includes(c.field)),
    [orderedColumns, hiddenColumns],
  );

  // ── Search ─────────────────────────────────────────────────────────────────
  const [internalSearch, setInternalSearch] = useState("");
  const searchQuery = isServerSearch
    ? (controlledSearch ?? "")
    : internalSearch;

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [internalPage, setInternalPage] = useState(1);
  const page = isServerPagination ? (controlledPage ?? 1) : internalPage;
  const setPage = isServerPagination ? onPageChange! : setInternalPage;

  // ── Sort ───────────────────────────────────────────────────────────────────
  const [internalSortField, setInternalSortField] = useState<string | null>(
    null,
  );
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc">("asc");
  const sortField = isServerSort ? controlledSortField : internalSortField;
  const sortDir = isServerSort ? (controlledSortDir ?? "asc") : internalSortDir;
  const handleSearchChange = useCallback(
    (q: string) => {
      if (isServerSearch) {
        onSearchChangeProp!(q);
      } else {
        setInternalSearch(q);
        setInternalPage(1);
      }
    },
    [isServerSearch, onSearchChangeProp],
  );
  const handleSort = useCallback(
    (field: string) => {
      if (isServerSort) {
        const nextDir: "asc" | "desc" =
          sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";
        onSortChange!({ field, dir: nextDir });
      } else {
        if (internalSortField === field) {
          setInternalSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
          setInternalSortField(field);
          setInternalSortDir("asc");
        }
      }
    },
    [isServerSort, sortField, sortDir, internalSortField, onSortChange],
  );

  // ── Client-side search ─────────────────────────────────────────────────────
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

  // ── Client-side sort ───────────────────────────────────────────────────────
  const sortedRows = useMemo<TRow[]>(() => {
    if (isServerSort || !sortField) return searchedRows;
    const col = orderedColumns.find((c) => c.field === sortField);
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
  }, [searchedRows, orderedColumns, sortField, sortDir, isServerSort]);

  // ── Pagination math ────────────────────────────────────────────────────────
  const effectiveTotalRows = isServerPagination
    ? (totalRows ?? 0)
    : sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalRows / pageSize));

  useEffect(() => {
    if (!isServerPagination && page > totalPages) setInternalPage(totalPages);
  }, [page, totalPages, isServerPagination]);

  const pagedRows = isServerPagination
    ? rows
    : sortedRows.slice((page - 1) * pageSize, page * pageSize);

  // ── Selection state (only computed when selectable) ────────────────────────
  const selected = isSelectable ? selectedRows! : [];
  const pageIds = pagedRows.map((r) => r.id);
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

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      updateSelected((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      updateSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  // ── Cell renderer ──────────────────────────────────────────────────────────
  const renderCell = (row: TRow, col: ColumnDef<TRow>): React.ReactNode => {
    if (col.renderCell) return col.renderCell(row);
    const val = getValue(row, col.field);
    return (val ?? "—") as React.ReactNode;
  };

  // ── Drag-to-reorder ────────────────────────────────────────────────────────
  const dragSrc = useRef<string | null>(null);

  const headerPointerDown =
    (field: string) => (e: ReactPointerEvent<HTMLTableCellElement>) => {
      if (e.button !== 0) return;
      dragSrc.current = field;
    };

  const headerPointerUp = (field: string) => () => {
    if (dragSrc.current && dragSrc.current !== field) {
      reorder(dragSrc.current, field);
    }
    dragSrc.current = null;
  };

  const ariaSort = (field: string): React.AriaAttributes["aria-sort"] => {
    if (sortField !== field) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
        onToggleColumn={handleToggleColumn}
        tableId={tableId}
      />

      {/* Horizontal scroll only — appears when table content exceeds container width */}
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
              {/* Select-all checkbox — only rendered when selection is enabled */}
              {isSelectable && (
                <th
                  role="columnheader"
                  scope="col"
                  className="!px-6 text-left w-10 bg-gray-100"
                >
                  <IndeterminateCheckbox
                    checked={allOnPageSelected}
                    indeterminate={someOnPageSelected}
                    label="Select all rows on this page"
                    onChange={handleSelectAll}
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
                      "relative text-sm font-semibold select-none bg-gray-100 !px-6 !py-3",
                      ALIGN[headerAlign],
                      col.sortable &&
                        "cursor-pointer hover:bg-gray-200 transition-colors",
                    )}
                    style={{ width }}
                    onClick={
                      col.sortable ? () => handleSort(col.field) : undefined
                    }
                    onPointerDown={headerPointerDown(col.field)}
                    onPointerUp={headerPointerUp(col.field)}
                    onPointerEnter={() => {
                      if (dragSrc.current && dragSrc.current !== col.field) {
                        reorder(dragSrc.current, col.field);
                        dragSrc.current = col.field;
                      }
                    }}
                  >
                    <span
                      className={cx(
                        "flex items-center gap-0.5 pr-3",
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
                  className="!px-6 text-center text-sm text-gray-400"
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
                  {/* Row checkbox — only rendered when selection is enabled */}
                  {isSelectable && (
                    <td
                      role="gridcell"
                      className="!p-6 w-20"
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.id}`}
                        className="w-4 h-4 rounded cursor-pointer"
                        checked={selected.includes(row.id)}
                        onChange={() =>
                          updateSelected((prev) =>
                            prev.includes(row.id)
                              ? prev.filter((id) => id !== row.id)
                              : [...prev, row.id],
                          )
                        }
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
                          "text-sm !px-6 !py-3",
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

      {/* Footer / pagination */}
      <div className="flex mt-2 text-typography-secondary border-t-0 items-center justify-between px-5 py-3 flex-wrap gap-2">
        <span className="text-sm" aria-live="polite" aria-atomic="true">
          {isSelectable && selected.length > 0
            ? `${selected.length} of ${effectiveTotalRows} selected`
            : `${effectiveTotalRows} records`}
        </span>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="px-3 py-1 text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          <span className="text-sm" aria-live="polite">
            Page {page} of {totalPages}
          </span>

          <button
            aria-label="Next page"
            className="px-3 py-1 text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
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
