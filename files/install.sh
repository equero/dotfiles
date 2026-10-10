#!/bin/bash
# Dotfiles installer — creates symlinks from ~ to this repo
# Usage: git clone <repo> ~/dotfiles && cd ~/dotfiles && bash install.sh

set -e

DOTFILES_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "Installing dotfiles from $DOTFILES_DIR"

# ── Claude Code ─────────────────────────────────────
mkdir -p "$CLAUDE_DIR/commands" "$CLAUDE_DIR/agents"

# Symlink settings
ln -sf "$DOTFILES_DIR/.claude/settings.json" "$CLAUDE_DIR/settings.json"
echo "  ✓ Claude settings"

# Symlink global instructions
ln -sf "$DOTFILES_DIR/.claude/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
echo "  ✓ Claude global instructions"

# Symlink keybindings
ln -sf "$DOTFILES_DIR/.claude/keybindings.json" "$CLAUDE_DIR/keybindings.json"
echo "  ✓ Claude keybindings"

# Symlink statusline
ln -sf "$DOTFILES_DIR/.claude/statusline.js" "$CLAUDE_DIR/statusline.js"
echo "  ✓ Claude statusline"

# Cleanup legacy bash statusline if present
rm -f "$CLAUDE_DIR/statusline-command.sh"

# Symlink commands
for cmd in "$DOTFILES_DIR/.claude/commands/"*.md; do
  name=$(basename "$cmd")
  ln -sf "$cmd" "$CLAUDE_DIR/commands/$name"
  echo "  ✓ Claude command: /$name"
done

# Symlink subagents
for agent in "$DOTFILES_DIR/.claude/agents/"*.md; do
  [ -e "$agent" ] || continue
  name=$(basename "$agent")
  ln -sf "$agent" "$CLAUDE_DIR/agents/$name"
  echo "  ✓ Claude agent: ${name%.md}"
done

# ── Neovim ─────────────────────────────────────────
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  NVIM_CONFIG="$APPDATA/../Local/nvim"
else
  NVIM_CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/nvim"
fi

if [ -d "$NVIM_CONFIG" ] && [ ! -L "$NVIM_CONFIG" ]; then
  echo "  ⚠ Backing up existing nvim config to ${NVIM_CONFIG}.bak"
  mv "$NVIM_CONFIG" "${NVIM_CONFIG}.bak"
elif [ -L "$NVIM_CONFIG" ]; then
  rm "$NVIM_CONFIG"
fi

ln -sf "$DOTFILES_DIR/nvim" "$NVIM_CONFIG"
echo "  ✓ Neovim config"

echo ""
echo "Done! Restart Claude Code and Neovim to apply changes."
