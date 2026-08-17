export type CsvColumn<T> = {
  key: keyof T;
  header: string;
  format?: (value: T[keyof T], row: T) => string;
};

const UTF_8_BOM = "\uFEFF";

function escapeCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function createCsvContent<T>(
  rows: readonly T[],
  columns: readonly CsvColumn<T>[],
): string {
  const headerRow = columns.map(({ header }) => escapeCsvCell(header)).join(",");
  const dataRows = rows.map((row) =>
    columns
      .map((column) => {
        const value = row[column.key];
        return escapeCsvCell(column.format?.(value, row) ?? value);
      })
      .join(","),
  );

  return `${UTF_8_BOM}${[headerRow, ...dataRows].join("\r\n")}`;
}

export function createTimestampedCsvFileName(
  prefix: string,
  date: Date = new Date(),
): string {
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const timestamp = date.toISOString().replace(/[:.]/g, "-");
  return `${safePrefix}-${timestamp}.csv`;
}

export function downloadCsv(content: string, fileName: string): boolean {
  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof Blob === "undefined"
  ) {
    return false;
  }

  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  try {
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }

  return true;
}
