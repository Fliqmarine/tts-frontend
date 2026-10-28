import ExcelJS from "exceljs";
import type { Manifest } from "../types/manifest.types";
import { DEMO_MANIFESTS } from "../components/ManifestIndexTable";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
const PURPLE = "FF6F42C1";
const GREY = "FFD9D9D9";
const edge = { style: "thin", color: { argb: "FF000000" } } as const;
const BORDER: Partial<ExcelJS.Borders> = { top: edge, left: edge, bottom: edge, right: edge };

type Entry = { label: string; counts: number[] };
const extra = (m: Manifest) => m as unknown as Record<string, unknown>;
const sum = (a: number[]) => a.reduce((t, n) => t + n, 0);

// Which date decides the month. Change the order here if you report on another date.
const getDate = (m: Manifest): Date | null => {
  const raw = extra(m).created_at ?? m.activation ?? extra(m).updated_at;
  if (!raw) return null;
  const s = String(raw);
  const d = new Date(s.length === 10 ? `${s}T00:00:00` : s);
  return isNaN(d.getTime()) ? null : d;
};

function tally(
  manifests: Manifest[],
  year: number,
  labelOf: (m: Manifest) => string,
  valueOf: (m: Manifest) => number = () => 1,
): Entry[] {
  const map = new Map<string, number[]>();
  for (const m of manifests) {
    const d = getDate(m);
    if (!d || d.getFullYear() !== year) continue;
    const label = labelOf(m).trim() || "N/A";
    const counts = map.get(label) ?? Array(12).fill(0);
    counts[d.getMonth()] += valueOf(m);
    map.set(label, counts);
  }
  return [...map]
    .map(([label, counts]) => ({ label, counts }))
    .sort((a, b) => sum(b.counts) - sum(a.counts) || a.label.localeCompare(b.label));
}

function addSection(
  ws: ExcelJS.Worksheet,
  top: number,
  title: string,
  firstHeader: string,
  entries: Entry[],
  monthCount: number,
): number {
  const totalCol = monthCount + 2;
  const letter = (c: number) => ws.getColumn(c).letter;
  const style = (cell: ExcelJS.Cell, o: { bold?: boolean; fill?: string; color?: string; center?: boolean } = {}) => {
    cell.font = { name: "Calibri", size: 11, bold: !!o.bold, color: { argb: o.color ?? "FF000000" } };
    cell.border = BORDER;
    if (o.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: o.fill } };
    if (o.center) cell.alignment = { horizontal: "center" };
  };

  // Title row
  ws.mergeCells(top, 1, top, totalCol);
  ws.getCell(top, 1).value = title;
  for (let c = 1; c <= totalCol; c++) {
    style(ws.getCell(top, c), { bold: true, fill: PURPLE, color: "FFFFFFFF", center: true });
  }

  // Header row
  [firstHeader, ...MONTHS.slice(0, monthCount), "Grand Total"].forEach((h, i) => {
    const cell = ws.getCell(top + 1, i + 1);
    cell.value = h;
    style(cell, { fill: GREY });
  });

  // Data rows
  const first = top + 2;
  entries.forEach((e, i) => {
    const r = first + i;
    const label = ws.getCell(r, 1);
    label.value = e.label;
    style(label, { bold: true });
    for (let m = 0; m < monthCount; m++) {
      const cell = ws.getCell(r, m + 2);
      cell.value = e.counts[m] > 0 ? e.counts[m] : null;
      style(cell);
    }
    const total = ws.getCell(r, totalCol);
    total.value = { formula: `SUM(B${r}:${letter(totalCol - 1)}${r})`, result: sum(e.counts.slice(0, monthCount)) };
    style(total, { bold: true });
  });

  // Grand total row
  const last = first + entries.length - 1;
  const gt = last + 1;
  const gtLabel = ws.getCell(gt, 1);
  gtLabel.value = "Grand Total";
  style(gtLabel, { bold: true, fill: GREY });
  let grand = 0;
  for (let c = 2; c <= totalCol; c++) {
    const col = c - 2;
    const result = c === totalCol
      ? grand
      : entries.reduce((t, e) => t + e.counts[col], 0);
    if (c < totalCol) grand += result;
    const cell = ws.getCell(gt, c);
    cell.value = entries.length
      ? { formula: `SUM(${letter(c)}${first}:${letter(c)}${last})`, result }
      : 0;
    style(cell, { bold: true, fill: GREY });
  }

  return gt + 5; // next table starts after 4 blank rows, like your file
}

export async function exportInternalReport(year = new Date().getFullYear()) {
  const manifests: Manifest[] = DEMO_MANIFESTS;
  const now = new Date();
  const monthCount = year === now.getFullYear() ? now.getMonth() + 1 : 12;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Worksheet");
  ws.getColumn(1).width = 49;
  for (let c = 2; c <= monthCount + 1; c++) ws.getColumn(c).width = 12;
  ws.getColumn(monthCount + 2).width = 14;

  let row = 1;
  row = addSection(ws, row, "MANIFEST COUNT", "CLIENT",
    tally(manifests, year, (m) => m.client), monthCount);
  row = addSection(ws, row, "MODE OF TRANSPORT", "MODE OF ARRIVAL",
    tally(manifests, year, (m) => m.mode), monthCount);
  row = addSection(ws, row, "PIC MANIFEST COUNT", "PIC",
    tally(manifests, year, (m) => String(extra(m).keyAccountManager ?? extra(m).pic ?? "")), monthCount);
  addSection(ws, row, "STOCK COUNT", "CLIENT",
    tally(manifests, year, (m) => m.client, (m) => m.stocks.length), monthCount);

  const buffer = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "Internal-report.xlsx";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
