## Dead Link Checker CLI

Professional, high-performance dead link checker for websites. This CLI crawls a target site, inspects every anchor, and produces JSON/CSV reports you can use to fix broken links and improve SEO and UX.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

> Replace the build badge with your real GitHub Actions badge once the repository is published.

---

## Features

- **🚀 High‑performance concurrent crawling**  
  Configurable concurrency lets you tune how many pages are processed in parallel while keeping the crawler safe and deterministic.

- **🛡️ Smart filtering**  
  Skips non-HTTP links like `mailto:`, `tel:`, `javascript:`, hash-only links, and noisy infrastructure paths such as `/cdn-cgi/*`, reducing false positives.

- **🔄 Infinite loop protection**  
  Robust URL normalization and a visited set prevent re-crawling the same page (e.g., `/`, `/index.html`, and trailing-slash variants).

- **📊 JSON & CSV reporting**  
  Structured reports are automatically written into the `results/` folder with timestamped filenames. Each record includes:
  - Source page URL
  - Target URL
  - HTTP status code
  - OK / broken flag
  - Anchor text (truncated for readability)

- **🧪 100% test coverage on core URL logic**  
  Core URL helpers such as `normalizeUrl` and `resolveUrl` are covered by Jest tests for reliability.

---

## Installation

```bash
git clone https://github.com/mehmeterenyasar/dead-link-checker.git
cd dead-link-checker
npm install
```

> Ensure you are using **Node.js 18+** (Node 20 is recommended and used in CI).

---

## Usage

### Basic scan

Run a simple crawl against a target site:

```bash
node src/index.js https://example.com
```

This will:

- Crawl internal pages starting from `https://example.com`
- Check the status of internal and external links
- Show a live spinner while crawling
- Print a summary report to the console

### Advanced options

#### Concurrency

Control the number of pages crawled in parallel:

```bash
node src/index.js https://example.com --concurrency 10
```

Higher concurrency speeds up scans but may increase load on the target site. Use responsibly.

#### Output format (non-interactive)

You can explicitly request JSON or CSV output:

```bash
# Save a JSON report into results/
node src/index.js https://example.com --output json

# Save a CSV report into results/
node src/index.js https://example.com --output csv
```

Reports are written into the `results/` directory with filenames like:

- `results/result-example.com-2026-01-28_13-34.json`
- `results/result-example.com-2026-01-28_13-34.csv`

### Interactive mode

When you **omit** the `--output` flag and run the CLI in a TTY (interactive terminal), the tool will prompt:

```text
Would you like to save the results? (json/csv/enter for console only):
```

- Type `json` → results will be saved as JSON into `results/`.
- Type `csv` → results will be saved as CSV into `results/`.
- Press **Enter** or type anything else → the scan runs with **console output only**, no files written.

This keeps the default experience simple while still making it easy to capture reports when needed.

---

## Project Structure

High-level layout:

```text
.
├─ src/
│  ├─ index.js        # CLI entry point: argument parsing, spinner, summary, and reporting
│  ├─ crawler.js      # Core crawling logic: queue, concurrency, link extraction, visited set
│  ├─ network.js      # HTTP helpers (axios configuration, User-Agent spoofing, status checks)
│  ├─ reporter.js     # JSON/CSV report writer into the results/ folder
│  ├─ url.js          # URL utilities: normalizeUrl, resolveUrl, getDomain
│  └─ utils.js        # Shared utilities (e.g., interactive readline prompt)
│
├─ test-sandbox/      # Small static site used for local testing (working/broken/ignored links)
├─ tests/
│  └─ url.test.js     # Jest tests for URL normalization and resolution
│
├─ results/           # Auto-generated reports (JSON/CSV) are written here
│  └─ result-*.json
│
├─ .eslintrc.json     # ESLint configuration (ES2022, Node, Prettier integration)
├─ .prettierrc        # Prettier configuration
├─ package.json       # Dependencies, scripts, and metadata
└─ .github/
   └─ workflows/
      └─ ci.yml       # GitHub Actions workflow for lint + test on pushes/PRs to main
```

---

## Development

### Linting

Run ESLint against the `src/` directory:

```bash
npm run lint
```

### Formatting

Format all source files with Prettier:

```bash
npm run format
```

### Testing

This project uses **Jest** with ESM support enabled via Node’s `--experimental-vm-modules` flag.

Run the full test suite:

```bash
npm test
```

You can add more tests under the `tests/` directory. Existing tests cover critical URL manipulation logic in `src/url.js`.

---

## Continuous Integration

A GitHub Actions workflow is provided at `.github/workflows/ci.yml`.

On every push and pull request to the `main` branch, the pipeline will:

1. Check out the repository
2. Set up Node.js 20
3. Install dependencies with `npm install`
4. Run `npm run lint`
5. Run `npm test`

Once this project is hosted on GitHub, you can connect the real build status badge to this workflow.

---

## License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it in both open-source and commercial projects, subject to the terms of the license.


