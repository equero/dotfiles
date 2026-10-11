-- [deck] persistence: save and restore sessions per project folder
-- https://github.com/folke/persistence.nvim
--
-- When you quit nvim, it saves the open files, splits and cursor positions
-- for the current folder (in ~/.local/state/nvim/sessions/). Next time you
-- open nvim in that folder, <leader>pr brings everything back.
--
-- Nothing is restored automatically: plain `nvim` still starts empty.

vim.pack.add { 'https://github.com/folke/persistence.nvim' }

require('persistence').setup()

-- neo-tree windows don't restore well (they come back as empty buffers),
-- so close the tree right before the session is saved
vim.api.nvim_create_autocmd('User', {
  pattern = 'PersistenceSavePre',
  callback = function() vim.cmd 'Neotree close' end,
})

local persistence = require 'persistence'
vim.keymap.set('n', '<leader>pr', function() persistence.load() end, { desc = '[P]roject [R]estore session' })
vim.keymap.set('n', '<leader>pl', function() persistence.load { last = true } end, { desc = '[P]roject restore [L]ast session' })
vim.keymap.set('n', '<leader>ps', function() persistence.select() end, { desc = '[P]roject [S]elect session' })
vim.keymap.set('n', '<leader>pd', function() persistence.stop() end, { desc = "[P]roject [D]on't save on exit" })

-- Label the group in the which-key popup
require('which-key').add { { '<leader>p', group = '[P]roject session' } }
