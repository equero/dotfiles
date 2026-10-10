import { createHighlighter, type Highlighter, type BundledLanguage } from "shiki";
import { extname } from "node:path";

let highlighterPromise: Promise<Highlighter> | null = null;

const LANG_BY_EXT: Record<string, BundledLanguage> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".json": "json",
  ".jsonc": "jsonc",
  ".md": "markdown",
  ".mdx": "mdx",
  ".html": "html",
  ".css": "css",
  ".scss": "scss",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".toml": "toml",
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".cmd": "bat",
  ".bat": "bat",
  ".ps1": "powershell",
  ".lua": "lua",
  ".vim": "vim",
  ".astro": "astro",
  ".vue": "vue",
};

const SPECIAL_BY_NAME: Record<string, BundledLanguage> = {
  "pre-commit": "bash",
  "post-merge": "bash",
  "post-update": "bash",
  "pre-push": "bash",
  ".gitignore": "ini",
  ".dotignore": "ini",
  Dockerfile: "docker",
  Makefile: "make",
};

export function detectLang(filename: string): BundledLanguage {
  if (SPECIAL_BY_NAME[filename]) return SPECIAL_BY_NAME[filename];
  const ext = extname(filename).toLowerCase();
  return LANG_BY_EXT[ext] ?? "text";
}

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "typescript",
        "tsx",
        "javascript",
        "jsx",
        "json",
        "jsonc",
        "markdown",
        "mdx",
        "html",
        "css",
        "scss",
        "yaml",
        "toml",
        "bash",
        "bat",
        "powershell",
        "lua",
        "vim",
        "astro",
        "vue",
        "ini",
        "docker",
        "make",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: BundledLanguage): Promise<string> {
  const hi = await getHighlighter();
  return hi.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
