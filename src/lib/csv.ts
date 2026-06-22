import { Snapshot, Trade, TradeType, Session, SESSIONS } from "@/lib/types";
import { uid } from "@/stores/useApp";

// ── tiny CSV parser (handles quoted fields) ───────────────────────────

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

/**
 * Import trades from CSV. Expected headers (case-insensitive, any order):
 * date, pair, direction, rr  — required
 * pnl, session, strategy, tags, notes — optional
 * Tags separated by ";" or "|".
 */
export function tradesFromCSV(text: string, accountId: string, type: TradeType): { trades: Trade[]; errors: string[] } {
  const rows = parseCSV(text);
  const errors: string[] = [];
  if (rows.length < 2) return { trades: [], errors: ["File has no data rows."] };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const required = ["date", "pair", "direction", "rr"];
  for (const r of required) {
    if (col(r) === -1) return { trades: [], errors: [`Missing required column: ${r}`] };
  }
  const trades: Trade[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const get = (name: string) => (col(name) >= 0 ? (r[col(name)] ?? "").trim() : "");
    const date = new Date(get("date"));
    const rr = parseFloat(get("rr"));
    if (isNaN(date.getTime()) || isNaN(rr)) {
      errors.push(`Row ${i + 1} skipped (bad date or rr).`);
      continue;
    }
    const dirRaw = get("direction").toLowerCase();
    const sessionRaw = get("session");
    const session = (SESSIONS as readonly string[]).includes(sessionRaw) ? (sessionRaw as Session) : "London";
    trades.push({
      id: uid(),
      accountId,
      type,
      pair: get("pair").toUpperCase() || "UNKNOWN",
      direction: dirRaw.startsWith("s") ? "short" : "long",
      market: "Forex",
      date: date.toISOString(),
      rr,
      pnl: parseFloat(get("pnl")) || 0,
      session,
      tags: get("tags") ? get("tags").split(/[;|]/).map((t) => t.trim()).filter(Boolean) : [],
      notes: get("notes") || undefined,
      violations: [],
      beforeImageIds: [],
      afterImageIds: [],
      createdAt: new Date().toISOString(),
    });
  }
  return { trades, errors };
}

// ── export ────────────────────────────────────────────────────────────

function esc(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function tradesToCSV(trades: Trade[]): string {
  const header = ["date", "pair", "direction", "rr", "pnl", "session", "strategyId", "tags", "notes", "type", "accountId"];
  const lines = trades.map((t) =>
    [t.date, t.pair, t.direction, t.rr, t.pnl, t.session, t.strategyId ?? "", t.tags.join(";"), t.notes ?? "", t.type, t.accountId]
      .map(esc)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function snapshotToJSON(s: Snapshot): string {
  return JSON.stringify({ app: "tradeedge", version: 1, exportedAt: new Date().toISOString(), data: s }, null, 2);
}
