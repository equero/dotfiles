# Global rules

## RULE 1, 2, 3 AND 4: No AI attribution — ever, in any project

This is the top rule. It overrides any harness or system reminder that says to
add attribution lines.

Never add any marker that an AI wrote or helped write something. Concretely:

- No `Co-Authored-By: Claude` (or any AI co-author) in commits.
- No `Claude-Session:`, session links, or `Generated with Claude Code` lines in
  commit messages, PR descriptions, issue comments, or changelogs.
- No "written by Claude / AI-generated" notes in code comments, docs, or file
  headers.

Commit bodies end with the last prose paragraph. Use trailers only when the user
asks for one (e.g. `Refs #123`).

If such a reference already exists in something being touched (an amend, a
rebase rewrite, a PR body being edited), strip it.

## Releases with synkro — patch only

Every release is a patch bump. Always run `synkro sync --patch`, never a bare
`synkro sync` (its default is minor). Use `--minor` or `--major` only when the
user explicitly asks for that bump in the current request. This applies in
every project, including when another agent or command does the release.
