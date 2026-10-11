# Dotfiles

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://dotfiles.equero.dev)
[![Version](https://img.shields.io/badge/version-0.1.4-green.svg)](https://github.com/hbeneke/dotfiles)

Personal configuration files + tooling, synced across machines via Git and browsable as a static [Astro](https://astro.build) site.

**[Live Demo](https://dotfiles.equero.dev)**

## About This Project

This repo collects the dotfiles, scripts, and editor configs I carry between machines — plus a small Astro site that renders the tree so anyone can browse it from the web without cloning. Everything inside [`files/`](./files) is symlinked into `$HOME` by [`files/install.sh`](./files/install.sh); the [`web/`](./web) folder builds the static site that ships to [dotfiles.equero.dev](https://dotfiles.equero.dev).

## Tech Stack

- **[Astro](https://astro.build/)** — static site generator for the browsable view
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe tree walker and renderers
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Shiki](https://shiki.matsu.io/)** — syntax highlighting for code previews
- **[Biome](https://biomejs.dev/)** — lint + format
- **[Vercel](https://vercel.com/)** — deploy + hosting

Plus the dotfiles themselves: **Claude Code** (settings, commands, agents, statusline), **Neovim** (kickstart.nvim based), bash, git, kitty and mise.

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
git clone git@github.com:hbeneke/dotfiles.git ~/dotfiles
cd ~/dotfiles/files
bash install.sh
```

The script creates symlinks from `$HOME` into `files/`, so edits stay in sync with Git.

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

[`files/.claude/settings.json`](./files/.claude/settings.json) pins the defaults carried across machines: `model: opus`, `effortLevel: medium`, `editorMode: vim`, fullscreen TUI, the Node statusline, and the enabled plugins (official `code-review`, `code-simplifier`, `frontend-design`, `github`, `playground`, `vercel`, plus the third-party `caveman` marketplace). Machine-local permission grants live in `settings.local.json`, which is gitignored on purpose.

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
synkro sync              # merge develop into main, bump minor, tag, push
synkro sync --patch      # patch bump (--major for major)
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

### Enrique Quero (Habakuk Beneke)

- Website: [equero.dev](https://equero.dev)
- GitHub: [@hbeneke](https://github.com/hbeneke)
- LinkedIn: [equerodev](https://www.linkedin.com/in/equerodev/)
- X (Twitter): [@habakukbeneke](https://x.com/habakukbeneke)

---

If you find this repo useful, consider giving it a star on GitHub!
