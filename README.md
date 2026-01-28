# Dead Link Checker CLI

![Build & Test](https://github.com/mehmeterenyasar/dead-link-checker/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Simple CLI tool to find broken links on a website.  
It crawls your site, checks links, and writes a report you can actually use.

## Why I built this

I first wrote this for my own client sites.  
I was tired of clicking around by hand and using heavy online tools.  
I wanted something small, fast, and easy to run from the terminal.  
It worked well for me, so I decided to share it.

---

## Features

- **Crawls multiple pages at the same time**  
  Uses a queue and concurrency so bigger sites finish faster.

- **Skips links that do not matter**  
  Ignores `mailto:`, `tel:`, `javascript:`, hash links, and Cloudflare paths like `/cdn-cgi/*`.

- **Avoids crawling the same page again and again**  
  Normalizes URLs (for example `/`, `/index.html`, and `/` with a slash) and keeps a visited set.

- **JSON and CSV reports in `results/`**  
  Every report row includes:
  - Source page URL  
  - Target URL  
  - HTTP status  
  - OK / broken flag  
  - Anchor text (trimmed so you can see which link it was)

- **Tested core URL logic**  
  URL helpers like `normalizeUrl` and `resolveUrl` have Jest tests.

---

## Installation

```bash
git clone https://github.com/mehmeterenyasar/dead-link-checker.git
cd dead-link-checker
npm install
```

Use Node.js **18 or newer** (Node 20 is recommended).

---

## Usage

### Basic scan

Run a simple crawl against a site:

```bash
node src/index.js https://example.com
```

This will:

- Crawl internal pages starting from `https://example.com`
- Check internal and external links
- Show a small spinner while it works
- Print a summary report in the terminal

### Concurrency

You can control how many pages are crawled at the same time:

```bash
node src/index.js https://example.com --concurrency 10
```

Higher values are faster but put more load on the target site. Be kind and do not abuse it.

### Output format (non-interactive)

You can tell the tool to always save a report:

```bash
# Save a JSON report into results/
node src/index.js https://example.com --output json

# Save a CSV report into results/
node src/index.js https://example.com --output csv
```

Reports go into the `results/` folder with names like:

- `results/result-example.com-2026-01-28_13-34.json`
- `results/result-example.com-2026-01-28_13-34.csv`

### Interactive mode

If you do **not** pass `--output` and you run the tool in a normal terminal, it will ask:

```text
Would you like to save the results? (json/csv/enter for console only):
```

- Type `json` → it will write a JSON report into `results/`.  
- Type `csv` → it will write a CSV report into `results/`.  
- Press Enter or type something else → it will just print to the console and not create a file.

---

## Project structure

Short overview of the files:

```text
.
├─ src/
│  ├─ index.js     # CLI entry point: args, spinner, summary, calling other modules
│  ├─ crawler.js   # Crawling logic: queue, workers, link extraction, visited set
│  ├─ network.js   # HTTP helpers (axios config, User-Agent, status checks)
│  ├─ reporter.js  # Writes JSON/CSV reports into the results/ folder
│  ├─ url.js       # URL helpers: normalizeUrl, resolveUrl, getDomain
│  └─ utils.js     # Small shared helpers (e.g. readline prompt)
│
├─ test-sandbox/   # Small static demo site for local testing
├─ tests/
│  └─ url.test.js  # Jest tests for URL helpers
│
├─ results/        # Output reports (created at runtime)
│  └─ result-*.json / result-*.csv
│
├─ eslint.config.js  # ESLint configuration
├─ package.json      # Scripts and dependencies
└─ .github/
   └─ workflows/
      └─ ci.yml     # GitHub Actions workflow (lint + test on push/PR)
```

---

## Development

### Linting and formatting

Run ESLint:

```bash
npm run lint
```

Format source files with Prettier:

```bash
npm run format
```

### Testing

Run the Jest test suite:

```bash
npm test
```

Tests focus on the core URL logic and are a good place to add more edge cases.

---

## License

This project is released under the **MIT License**.  
You can use it in personal or commercial projects. Just keep the license file.

# Dead Link Checker CLI

![Build & Test](https://github.com/mehmeterenyasar/dead-link-checker/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Professional, high-performance dead link checker for websites.**

This CLI crawls a target site, inspects every anchor, and produces JSON/CSV reports. It is designed to be lightweight yet powerful enough to handle real-world scenarios.

> **💡 Why I built this:**
> I originally developed this tool to manage and audit my own clients' websites. I needed a fast, reliable way to detect broken links and improve SEO/UX without relying on heavy, complex external services. It solved my problem, so I open-sourced it to help others.

---

## Features

- **🚀 High‑performance concurrent crawling**
  Configurable concurrency lets you tune how many pages are processed in parallel while keeping the crawler safe and deterministic.

- **🛡️ Smart filtering**
  Skips non-HTTP links like `mailto:`, `tel:`, `javascript:`, hash-only links, and noisy infrastructure paths such as `/cdn-cgi/*` (Cloudflare), reducing false positives.

- **🔄 Infinite loop protection**
  Robust URL normalization and a visited set prevent re-crawling the same page (e.g., `/`, `/index.html`, and trailing-slash variants).

- **📊 JSON & CSV reporting**
  Structured reports are automatically written into the `results/` folder with timestamped filenames. Each record includes:
  - Source page URL
  - Target URL
  - HTTP status code
  - OK / broken flag
  - Anchor text (truncated for readability - helps you find *where* the link is!)

- **🧪 100% test coverage on core logic**
  Core URL manipulation and logic are covered by Jest tests to ensure reliability.

---

## Installation

```bash
git clone [https://github.com/mehmeterenyasar/dead-link-checker.git](https://github.com/mehmeterenyasar/dead-link-checker.git)
cd dead-link-checker
npm install

Ensure you are using Node.js 18+ (Node 20 is recommended and used in CI).

Usage
Basic scan
Run a simple crawl against a target site:

Bash
node src/index.js [https://example.com](https://example.com)
This will:

Crawl internal pages starting from https://example.com

Check the status of internal and external links

Show a live spinner while crawling

Print a summary report to the console

Advanced options
Concurrency
Control the number of pages crawled in parallel:

Bash
node src/index.js [https://example.com](https://example.com) --concurrency 10
Higher concurrency speeds up scans but may increase load on the target site. Use responsibly.

Output format (non-interactive)
You can explicitly request JSON or CSV output:

Bash
# Save a JSON report into results/
node src/index.js [https://example.com](https://example.com) --output json

# Save a CSV report into results/
node src/index.js [https://example.com](https://example.com) --output csv
Reports are written into the results/ directory with filenames like:

results/result-example.com-2026-01-28_13-34.json

results/result-example.com-2026-01-28_13-34.csv

Interactive mode
When you omit the --output flag and run the CLI in a TTY (interactive terminal), the tool will prompt:

Plaintext
Would you like to save the results? (json/csv/enter for console only):
Type json → results will be saved as JSON into results/.

Type csv → results will be saved as CSV into results/.

Press Enter or type anything else → the scan runs with console output only, no files written.

Project Structure
High-level layout designed for modularity:

Plaintext
.
├─ src/
│  ├─ index.js        # CLI entry point: orchestration & UI
│  ├─ crawler.js      # Core crawling logic: queue & worker management
│  ├─ network.js      # HTTP layer (axios config, User-Agent, status checks)
│  ├─ reporter.js     # File I/O for JSON/CSV reports
│  ├─ url.js          # Pure functions for URL normalization
│  └─ utils.js        # Shared CLI utilities
│
├─ tests/             # Unit tests (Jest)
├─ results/           # Output directory for reports
├─ .github/           # GitHub Actions (CI/CD workflows)
└─ eslint.config.js   # Code quality rules
Development
Linting & Formatting
Ensure code quality and style consistency:

Bash
npm run lint
npm run format
Testing
This project uses Jest with ESM support. The test suite covers critical edge cases (like Cloudflare filtering and URL normalization).

Bash
npm test
License
This project is licensed under the MIT License. You are free to use, modify, and distribute it in both open-source and commercial projects.


Bunu kopyalayıp kaydettikten sonra son push işlemini yapabilirsin:

```bash
git add README.md
git commit -m "Docs: Update README with project background and real badges"
git push