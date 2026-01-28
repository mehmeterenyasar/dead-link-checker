# Dead Link Checker CLI

![Build & Test](https://github.com/mehmeterenyasar/dead-link-checker/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Simple CLI tool to find broken links on a website.  
It crawls your site, checks links, and writes a report you can actually use.

## Why I built this

I first wrote this for my own client sites.  
I wanted something small, fast, and reliable.
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


Bunu kopyalayıp kaydettikten sonra son push işlemini yapabilirsin:

```bash
git add README.md
git commit -m "Docs: Update README with project background and real badges"
git push
