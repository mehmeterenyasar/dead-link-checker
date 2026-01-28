import { promises as fs } from "fs";
import path from "path";

export async function writeReport(format, data) {
  const hostname = sanitizeHostname(data.targetUrl);
  const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "-");

  const ext = format === "csv" ? ".csv" : ".json";
  const filename = `result-${hostname}-${timestamp}${ext}`;

  const resultsDir = path.join(process.cwd(), "results");
  await fs.mkdir(resultsDir, { recursive: true });

  const fullPath = path.join(resultsDir, filename);

  if (format === "csv") {
    await fs.writeFile(fullPath, toCsv(data.linkResults));
  } else {
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
  }

  const relative = path.relative(process.cwd(), fullPath);
  return relative || fullPath;
}

function toCsv(results) {
  const escape = (val) => `"${String(val || "").replace(/"/g, '""')}"`;
  const header = "Source,URL,Status,OK,Text";

  const rows = results.map((r) =>
    [
      escape(r.source),
      escape(r.href),
      r.status || "",
      r.ok ? "true" : "false",
      escape(r.text ?? ""),
    ].join(",") 
  );

  return [header, ...rows].join("\n");
}

function sanitizeHostname(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/[^a-z0-9.-]/gi, "_");
  } catch {
    return "site";
  }
}
