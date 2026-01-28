#!/usr/bin/env node

import chalk from "chalk";
import { crawlSite } from "./crawler.js";
import { writeReport } from "./reporter.js";
import { askQuestion } from "./utils.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`${chalk.red("Error:")} No URL provided.`);
    console.error(
      `Usage: ${chalk.cyan("dead-link-checker <url>")} [--concurrency N] [--output json|csv]`
    );
    process.exit(1);
  }

  const targetUrl = args[0];
  const concurrencyIdx = args.indexOf("--concurrency");
  const outputIdx = args.indexOf("--output");

  const concurrency = concurrencyIdx !== -1 ? parseInt(args[concurrencyIdx + 1]) || 5 : 5;
  let outputFormat = null;

  if (outputIdx !== -1 && args[outputIdx + 1]) {
    const fmt = String(args[outputIdx + 1]).toLowerCase();
    if (fmt === "csv" || fmt === "json") outputFormat = fmt;
  }

  if (!outputFormat && process.stdin.isTTY && process.stdout.isTTY) {
    const answer = (
      await askQuestion("Would you like to save the results? (json/csv/enter for console only): ")
    )
      .trim()
      .toLowerCase();

    if (answer === "json" || answer === "csv") {
      outputFormat = answer;
      console.log(`Using format: ${chalk.magenta(outputFormat)}`);
    } else if (answer.length > 0) {
      console.log("Proceeding with console output only...");
    }
  }

  console.log(chalk.bold("\n🔍 Dead Link Checker"));
  console.log(`Target: ${chalk.cyan(targetUrl)} | Concurrency: ${chalk.yellow(concurrency)}`);
  if (outputFormat) console.log(`Output format: ${chalk.magenta(outputFormat)}`);

  const startTime = Date.now();
  const spinnerFrames = ["|", "/", "-", "\\"];
  let frameIndex = 0;

  const spinner = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const frame = spinnerFrames[frameIndex];
    frameIndex = (frameIndex + 1) % spinnerFrames.length;
    process.stdout.write(`\r[ ${frame} ] Crawling... (${elapsed.toFixed(1)}s)`);
  }, 100);

  try {
    const { pagesVisited, linkResults } = await crawlSite(targetUrl, { concurrency });

    clearInterval(spinner);
    process.stdout.write("\r" + " ".repeat(60) + "\r");

    const brokenLinks = linkResults.filter((r) => !r.ok);
    const elapsedSeconds = (Date.now() - startTime) / 1000;

    console.log(chalk.bold("\nSummary Report"));
    console.log("==============");
    console.log(`Pages crawled:       ${chalk.green(pagesVisited.size)}`);
    console.log(`Total links checked: ${chalk.green(linkResults.length)}`);
    console.log(
      `Broken links:        ${brokenLinks.length > 0 ? chalk.red(brokenLinks.length) : chalk.green(0)}`
    );
    console.log(`Time elapsed:        ${chalk.cyan(elapsedSeconds.toFixed(2) + "s")}`);

    if (!outputFormat && brokenLinks.length > 0) {
      console.log(chalk.red.bold("\nBroken Links Found:"));
      brokenLinks.forEach(({ href, status, source }) => {
        const statusLabel = status ? status : "N/A";
        console.log(`- ${chalk.yellow(href)} [${chalk.red(statusLabel)}]`);
        console.log(`  on: ${chalk.dim(source)}`);
      });
    } 

    if (outputFormat) {
      const relativePath = await writeReport(outputFormat, {
        targetUrl,
        linkResults,
        pagesVisited: [...pagesVisited],
      });
      console.log(chalk.green.bold(`\n✔ Report saved to ${relativePath}`));
    }
  } catch (err) {
    clearInterval(spinner);
    console.error(chalk.red("\nFatal Error:"), err.message || err);
    process.exit(1);
  }
}

main();
