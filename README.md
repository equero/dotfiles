# Dotfiles

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://dotfiles.equero.dev)
[![Version](https://img.shields.io/github/v/tag/equero/dotfiles?label=version&color=green)](https://github.com/equero/dotfiles/tags)

Personal configuration files + tooling, synced across machines via Git and browsable as a static [Astro](https://astro.build) site.

**[Live Demo](https://dotfiles.equero.dev)**

## About This Project

This repo collects the dotfiles, scripts, and editor configs I carry between machines — plus a small Astro site that renders the tree so anyone can browse it from the web without cloning. Everything inside [`files/`](./files) is symlinked into `$HOME` by [`files/install.sh`](./files/install.sh); the [`web/`](./web) folder builds the static site that ships to [dotfiles.equero.dev](https://dotfiles.equero.dev).

## What's Inside

| Config | Target | Highlights |
|---|---|---|
| [Claude Code](./files/.claude) | `~/.claude/` | Global rules, model-routed subagents, `/audit` and `/ssh` commands, Catppuccin status line with context and plan usage |
| [Neovim](./files/nvim) | `~/.config/nvim` | kickstart.nvim on Neovim 0.12's built-in `vim.pack`, plugin versions pinned in a lock file, web-dev LSPs, file tree, session restore |
| [Bash](./files/bash/bashrc) | `~/.bashrc` | mise activation, `dev` helper for the distrobox container, Catppuccin prompt |
| [Git](./files/git/gitconfig) | `~/.gitconfig` | Identity, `main` as default branch |
| [kitty](./files/kitty/kitty.conf) | `~/.config/kitty/kitty.conf` | Catppuccin Mocha, JetBrainsMono Nerd Font, splits and tabs keymaps |
| [mise](./files/mise/config.toml) | `~/.config/mise/config.toml` | Node LTS |

Everything is themed with [Catppuccin Mocha](https://catppuccin.com). The main machine is a Steam Deck (SteamOS + an Arch [distrobox](https://distrobox.it) called `dev`), but nothing depends on it.

## Tech Stack (website)

- **[Astro](https://astro.build/)** — static site generator for the browsable view
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe tree walker and renderers
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Shiki](https://shiki.matsu.io/)** — syntax highlighting for code previews
- **[Biome](https://biomejs.dev/)** — lint + format
- **[Vercel](https://vercel.com/)** — deploy + hosting


## Project Structure

```text
.
├── files/                    ← actual dotfiles content (symlinked to $HOME)
│   ├── .claude/              ← Claude Code settings, statusline, commands, agents
│   │   ├── CLAUDE.md         ← global instructions applied to every project
│   │   ├── keybindings.json  ← custom key bindings (vim editor mode)
│   │   ├── commands/         ← user-invocable /commands
│   │   └── agents/           ← orchestrator subagents (model-routed)
│   ├── nvim/                 ← Neovim configuration (kickstart.nvim based)
│   ├── bash/bashrc           ← ~/.bashrc (mise, `dev` distrobox helper, prompt)
│   ├── git/gitconfig         ← ~/.gitconfig (identity, default branch)
│   ├── kitty/kitty.conf      ← kitty terminal (Catppuccin Mocha, splits)
│   ├── mise/config.toml      ← mise tool versions (node LTS)
│   └── install.sh            ← symlink installer
│
├── web/                      ← Astro app that renders files/ as a static site
│   ├── src/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
│
└── package.json              ← root (version + web scripts)
```

## Dotfiles Installation

```bash
git clone git@github.com:equero/dotfiles.git ~/dotfiles
bash ~/dotfiles/files/install.sh
```

The script creates symlinks from `$HOME` into `files/`, so edits stay in sync with Git. It's safe to run again: an existing real file is renamed to `.bak` before it's replaced, and existing symlinks are just updated.

Requirements: `git`, `node` (for the Claude Code status line) and whatever each config is for (Neovim 0.12+, kitty, mise). The Neovim requirements are listed in [`files/nvim/README.md`](./files/nvim/README.md). On Windows (Git Bash) everything except kitty is linked.

> **Heads-up:** your live configs point into this working copy. Checking out a branch or tag that lacks one of them breaks it until you switch back (for example, git loses your identity if `files/git/gitconfig` is missing). Keep the clone on `develop` or `main`.

## Claude Code Subagents

[`files/.claude/agents/`](./files/.claude/agents) ships an orchestrator + subagent setup so Claude Code routes work to the cheapest capable model instead of running everything on Opus.

| Agent                | Model  | Use for                                                          |
|----------------------|--------|------------------------------------------------------------------|
| `commit-fast`        | haiku  | git diff → Conventional Commits message + commit                 |
| `pr-describe`        | haiku  | branch diff → PR title + body                                    |
| `quick-search`       | haiku  | one-shot symbol/file lookups                                     |
| `test-writer`        | sonnet | write tests matching repo style                                  |
| `refactor-clean`     | sonnet | behavior-preserving refactors                                    |
| `architect`          | sonnet | everyday design / planning multi-file changes (~95% of cases)    |
| `senior-architect`   | opus   | hard design problems — invoke with "senior architect" phrase     |
| `bug-investigator`   | sonnet | static root-cause analysis from a bug description / stack trace  |
| `js-console-debugger`| sonnet | two-phase JS/TS debugging — instruments code, diagnoses logs     |
| `git-diff-commit-analyzer` | sonnet | deep diff analysis → conventional commit message + split advice |

### Settings

[`files/.claude/settings.json`](./files/.claude/settings.json) pins the defaults carried across machines: `model: opus`, `effortLevel: medium`, `editorMode: vim`, fullscreen TUI, the status line, and the enabled plugins (official `code-review`, `code-simplifier`, `frontend-design`, `github`, `playground`, `vercel`, plus the third-party `caveman` marketplace). Machine-local permission grants live in `settings.local.json`, which is gitignored on purpose.

### Status line

[`files/.claude/statusline.cjs`](./files/.claude/statusline.cjs) is a dependency-free Node script (Windows, macOS and Linux) that renders one line in Catppuccin Mocha colors:

```text
🤖 Opus | 📁 dotfiles | 🌿 develop +12 -3 | ████░░░░░░ 42% | ⏳ 5h 23% (2h05m) · 7d 41%
```

Model, folder, git branch (and worktree) with uncommitted line changes, context window usage, and plan usage for the 5-hour and 7-day limits (Pro/Max plans). The bars turn yellow at 60% and red at 80%. It needs a truecolor terminal.

### Rules and key bindings

[`files/.claude/CLAUDE.md`](./files/.claude/CLAUDE.md) holds the global rules injected into every project, and [`files/.claude/keybindings.json`](./files/.claude/keybindings.json) the custom key bindings.

The main agent acts as the router — it reads each subagent's `description` and delegates. Edit any `.md` file in `files/.claude/agents/` to tune routing or swap models (`model: haiku | sonnet | opus | inherit`).

## Web (Development)

```bash
npm run install:web      # installs web/ dependencies
npm run dev              # local dev at http://localhost:4321
npm run build            # static build into web/dist/
npm run preview
```

The Astro app walks `files/` at build time, respects per-folder `.dotignore` entries, and renders any `README.md` it finds. The Vercel project's **Root Directory** is set to `web/`.

## Git Flow

The repo follows a `develop` → `main` flow. Releases are done with [synkro](https://github.com/equero/synkro):

```bash
synkro status            # what the next release would contain
synkro sync --patch      # merge develop into main, bump patch, tag, push (the usual)
synkro sync              # same, minor bump (--major for major)
synkro sync --dry-run    # show what would happen, change nothing
```

Each release is a single merge commit on `main` that also carries the new version, tagged `vX.Y.Z` with a changelog. `develop` is fast-forwarded to it afterwards.

## Contributing

This is a personal repo, but it's open source under the GPL-3.0 license — feel free to fork it as a starting point for your own dotfiles.

### Guidelines

- Follow the existing code style (enforced by Biome inside `web/`).
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, …).
- Branch off `develop`; never commit directly to `main`.
- Update the relevant `README.md` inside `files/<subdir>/` when you change something user-facing.

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](./LICENSE) file for details.

## Author

### Enrique Quero

- Website: [equero.dev](https://equero.dev)
- GitHub: [@equero](https://github.com/equero)
- LinkedIn: [equerodev](https://www.linkedin.com/in/equerodev/)

---

If you find this repo useful, consider giving it a star on GitHub!
