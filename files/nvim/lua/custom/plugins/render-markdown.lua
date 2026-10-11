-- [deck] render-markdown: pretty Markdown right inside the buffer
-- https://github.com/MeanderingProgrammer/render-markdown.nvim
--
-- Headings, checkboxes, tables, code blocks and quotes are drawn nicely in
-- normal mode. On the line under the cursor (and in insert mode) you see the
-- raw Markdown again, so editing stays normal.
--
-- Uses the treesitter parsers 'markdown' + 'markdown_inline' (already
-- installed in init.lua) and mini.icons for the code block language icons.
--
-- Toggle on/off with <leader>tm (or :RenderMarkdown toggle).

vim.pack.add { 'https://github.com/MeanderingProgrammer/render-markdown.nvim' }

require('render-markdown').setup {
  -- Show the raw text again while typing, rendered view in normal mode
  render_modes = { 'n', 'c', 't' },
  -- Nice checkboxes for the progress-log style guides in ~/Documents
  checkbox = {
    unchecked = { icon = '󰄱 ' },
    checked = { icon = '󰱒 ' },
  },
}

vim.keymap.set('n', '<leader>tm', '<cmd>RenderMarkdown toggle<CR>', { desc = '[T]oggle [M]arkdown render' })
