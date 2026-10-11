# Neovim config

Based on [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) (MIT, see `LICENSE.md`). Plugins are managed by Neovim's built-in `vim.pack`, and their exact versions are pinned in `nvim-pack-lock.json`.

Personal changes are marked with `-- [deck]` in `init.lua`. Extra plugins live in `lua/custom/plugins/` (one file per plugin, loaded automatically).

## Requirements (Linux)

- **Neovim 0.12+** (needed for `vim.pack`)
- `git`, `make`, `gcc`, `unzip`
- `ripgrep` and `fd` (Telescope search)
- `node` + `npm` (Mason installs the web language servers with them)
- `tree-sitter-cli` (builds treesitter parsers)
- A [Nerd Font](https://www.nerdfonts.com/) in the terminal (JetBrainsMono Nerd Font)

On Arch: `sudo pacman -S neovim git base-devel unzip ripgrep fd nodejs npm tree-sitter-cli`

## Install

`files/install.sh` symlinks this folder to `~/.config/nvim`. Open `nvim` once: plugins, language servers and parsers download on their own. Run `:checkhealth` if something is missing.

## What's included

- **Web dev**: LSP for TypeScript/JavaScript, HTML, CSS, Tailwind, ESLint and JSON; Prettier (`prettierd`) on save
- **Search**: Telescope (`<leader>s…`)
- **Completion**: blink.cmp + LuaSnip
- **Git**: gitsigns (`<leader>h…`)
- **File tree**: neo-tree (`\`)
- **Sessions**: persistence.nvim (`<leader>p…`)
- **Markdown**: render-markdown.nvim (`<leader>tm`)
- **Theme**: Catppuccin Mocha
