#!/usr/bin/env node
// Lo-Claude Status Line for Claude Code
// Cross-platform (Windows / Linux / macOS) — no external deps
// Single line: 🤖 model | 📁 folder | 🌿 branch +added -removed | bar pct% | ⏳ 5h pct (reset) · 7d pct
// Colors: Catppuccin Mocha (24-bit), needs a truecolor terminal

const { execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

// Catppuccin Mocha palette — https://catppuccin.com/palette
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `\x1b[38;2;${n >> 16};${(n >> 8) & 255};${n & 255}m`;
};
const C = {
  R: "\x1b[0m",
  BOLD: "\x1b[1m",
  MAUVE: rgb("#cba6f7"),
  BLUE: rgb("#89b4fa"),
  GREEN: rgb("#a6e3a1"),
  YELLOW: rgb("#f9e2af"),
  RED: rgb("#f38ba8"),
  PINK: rgb("#f5c2e7"),
  TEAL: rgb("#94e2d5"),
  SURFACE: rgb("#45475a"),
  OVERLAY: rgb("#6c7086"),
};

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function git(args, cwd) {
  try {
    return execSync(`git ${args}`, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

// Claude Code sends the context usage already calculated against the real
// window size (200k, or 1M for extended context). null early in a session.
function computePct(input) {
  const pct = input?.context_window?.used_percentage;
  return Math.min(100, Math.floor(pct || 0));
}

// Filled part in the usage color, empty part in a dim surface color
function buildBar(pct, color) {
  const filled = Math.floor(pct / 10);
  return `${color}${"█".repeat(filled)}${C.SURFACE}${"░".repeat(10 - filled)}${C.R}`;
}

function barColor(pct) {
  if (pct >= 80) return C.RED;
  if (pct >= 60) return C.YELLOW;
  return C.GREEN;
}

// "2h05m" / "45m" until the given Unix time (seconds)
function timeLeft(resetsAt) {
  const mins = Math.max(0, Math.round((resetsAt * 1000 - Date.now()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h${String(m).padStart(2, "0")}m` : `${m}m`;
}

// Plan usage (Pro/Max only): 5-hour window with time to reset, plus 7-day.
// Each window can be missing, e.g. before the first answer of a session.
function usagePart(limits) {
  const parts = [];
  const five = limits?.five_hour;
  if (five?.used_percentage != null) {
    const pct = Math.floor(five.used_percentage);
    const reset = five.resets_at ? ` ${C.OVERLAY}(${timeLeft(five.resets_at)})` : "";
    parts.push(`${barColor(pct)}5h ${pct}%${reset}${C.R}`);
  }
  const week = limits?.seven_day;
  if (week?.used_percentage != null) {
    const pct = Math.floor(week.used_percentage);
    parts.push(`${barColor(pct)}7d ${pct}%${C.R}`);
  }
  return parts.length ? `${C.TEAL}⏳ ${C.R}${parts.join(` ${C.OVERLAY}·${C.R} `)}` : "";
}

function main() {
  let input = {};
  try {
    input = JSON.parse(readStdin() || "{}");
  } catch {}

  const model = input?.model?.display_name || "Claude";
  const dir = input?.workspace?.current_dir || process.cwd();
  const folder = path.basename(dir) || dir;

  const pct = computePct(input);
  const bar = buildBar(pct, barColor(pct));
  const usage = usagePart(input?.rate_limits);

  let gitPart = "";
  if (git("rev-parse --git-dir", dir)) {
    let branch = git("branch --show-current", dir);
    if (!branch) branch = git("rev-parse --short HEAD", dir);

    const diff = git("diff --shortstat", dir);
    const addedM = diff.match(/(\d+) insertion/);
    const delM = diff.match(/(\d+) deletion/);
    const added = addedM?.[1];
    const deleted = delM?.[1];

    const worktreeDir = git("rev-parse --show-toplevel", dir);
    const worktreeName = worktreeDir ? path.basename(worktreeDir) : "";
    const worktreeList = git("worktree list", dir);
    const mainRepoPath = worktreeList.split(/\r?\n/)[0]?.split(/\s+/)[0] || "";
    const mainRepoName = mainRepoPath ? path.basename(mainRepoPath) : "";

    if (worktreeName && worktreeName !== mainRepoName) {
      gitPart = `${C.PINK}🌲 ${worktreeName}${C.R} ${C.GREEN}🌿 ${branch}${C.R}`;
    } else if (branch) {
      gitPart = `${C.GREEN}🌿 ${branch}${C.R}`;
    }

    if (added || deleted) {
      gitPart += " ";
      if (added) gitPart += `${C.GREEN}+${added}${C.R}`;
      if (added && deleted) gitPart += " ";
      if (deleted) gitPart += `${C.RED}-${deleted}${C.R}`;
    }
  }

  const sep = ` ${C.OVERLAY}|${C.R} `;
  let line = `${C.BOLD}${C.MAUVE}🤖 ${model}${C.R}${sep}${C.BLUE}📁 ${folder}${C.R}`;
  if (gitPart) line += `${sep}${gitPart}`;
  line += `${sep}${bar} ${barColor(pct)}${pct}%${C.R}`;
  if (usage) line += `${sep}${usage}`;

  process.stdout.write(line + "\n");
}

main();
