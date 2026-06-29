import { Snapshot, Trade, TradeType, Session, SESSIONS, sessionFromDate } from "@/lib/types";
import { uid } from "@/stores/useApp";

// ── tiny CSV parser (handles quoted fields) ───────────────────────────

export function parseCSV(text: string, delim = ","): string[][] {
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
    else if (c === delim) {
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

/** Guess the column delimiter from the header line (comma, semicolon, or tab). */
function detectDelimiter(firstLine: string): string {
  const counts: Record<string, number> = {
    ",": (firstLine.match(/,/g) || []).length,
    ";": (firstLine.match(/;/g) || []).length,
    "\t": (firstLine.match(/\t/g) || []).length,
  };
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// Accepted header names for each canonical field (lower-cased, trimmed).
const ALIASES: Record<string, string[]> = {
  date: ["date", "entry date", "open date", "opened", "datetime", "date/time", "time", "entry time", "open time", "trade date", "datestart", "date start", "opentime", "start", "start time"],
  pair: ["pair", "symbol", "asset", "instrument", "ticker", "market"],
  direction: ["direction", "side", "position", "type", "buy/sell", "b/s", "long/short"],
  rr: ["rr", "r", "r multiple", "r-multiple", "rmultiple", "return (r)", "r:r", "risk reward", "risk/reward", "avgriskreward", "avg risk reward", "avgrr", "avg rr", "rrr"],
  pnl: ["pnl", "p&l", "p/l", "profit", "net p&l", "net pnl", "return ($)", "return $", "return", "profit/loss", "realized p&l", "gross p&l", "result", "rpnl", "realized pnl", "realizedpnl", "net profit"],
  session: ["session"],
  tags: ["tags", "tag", "labels"],
  notes: ["notes", "note", "comment", "comments", "remark", "remarks"],
};

/** Normalize "2025/01/03 10:59:30" → ISO-parseable so every browser agrees. */
function normalizeDate(s: string): string {
  const m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})[ T](\d{2}:\d{2}(:\d{2})?)/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}`;
  return s;
}

/**
 * Import trades from CSV. Expected headers (case-insensitive, any order):
 * date, pair, direction, rr  — required
 * pnl, session, strategy, tags, notes — optional
 * Tags separated by ";" or "|".
 */
export function tradesFromCSV(text: string, accountId: string, type: TradeType): { trades: Trade[]; errors: string[] } {
  // Strip UTF-8 BOM that Excel/Sheets prepend to the first cell.
  text = text.replace(/^\uFEFF/, "");
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delim = detectDelimiter(firstLine);
  const rows = parseCSV(text, delim);
  const errors: string[] = [];
  if (rows.length < 2) return { trades: [], errors: ["File has no data rows."] };

  const header = rows[0].map((h) => h.trim().toLowerCase());
  // Resolve each canonical field to a column index via its aliases.
  const idx: Record<string, number> = {};
  for (const [canon, names] of Object.entries(ALIASES)) {
    idx[canon] = header.findIndex((h) => names.includes(h));
  }

  // Need date, pair, direction, and at least one of rr / pnl.
  const missing: string[] = [];
  if (idx.date < 0) missing.push("date");
  if (idx.pair < 0) missing.push("pair");
  if (idx.direction < 0) missing.push("direction");
  if (idx.rr < 0 && idx.pnl < 0) missing.push("rr or pnl");
  if (missing.length) {
    return {
      trades: [],
      errors: [
        `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`,
        `Found headers: ${header.join(", ") || "(none)"}.`,
      ],
    };
  }

  const trades: Trade[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const get = (canon: string) => (idx[canon] >= 0 ? (r[idx[canon]] ?? "").trim() : "");
    const date = new Date(normalizeDate(get("date")));
    const rrStr = get("rr");
    const pnlStr = get("pnl").replace(/[$,]/g, "");
    const rr = rrStr !== "" ? parseFloat(rrStr) : NaN;
    const pnl = pnlStr !== "" ? parseFloat(pnlStr) : NaN;
    if (isNaN(date.getTime()) || (isNaN(rr) && isNaN(pnl))) {
      errors.push(`Row ${i + 1} skipped (bad date, or no rr/pnl value).`);
      continue;
    }
    const dirRaw = get("direction").toLowerCase();
    const sessionRaw = get("session");
    const session = (SESSIONS as readonly string[]).includes(sessionRaw) ? (sessionRaw as Session) : sessionFromDate(date);
    // Strip exchange prefix like "OANDA:XAUUSD" → "XAUUSD".
    const rawPair = get("pair").toUpperCase();
    const pair = (rawPair.includes(":") ? rawPair.split(":").pop()! : rawPair) || "UNKNOWN";
    trades.push({
      id: uid(),
      accountId,
      type,
      pair,
      direction: dirRaw.startsWith("s") ? "short" : "long",
      market: "Forex",
      date: date.toISOString(),
      rr: isNaN(rr) ? 0 : rr,
      pnl: isNaN(pnl) ? 0 : pnl,
      session,
      tags: get("tags") ? get("tags").split(/[;|]/).map((t) => t.trim()).filter(Boolean) : [],
      notes: get("notes") || undefined,
      violations: [],
      beforeImageIds: [],
      afterImageIds: [],
      createdAt: new Date().toISOString(),
    });
  }
  if (trades.length === 0 && errors.length) errors.unshift("No rows could be imported — check the date and rr/pnl columns.");
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
