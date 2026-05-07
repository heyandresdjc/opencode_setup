# Agent Notes

This repo is the personal OpenCode configuration at `~/.config/opencode`. It is not an application—there is no build, test, or lint pipeline.

## Source of truth

- **`opencode.json`** defines all custom agents, models, and prompts.
  - **Default agent**: `plan` (read-only, planning-first workflow)
  - `reviewer` → `opencode/Qwen3.6 Plus` (read-only tools)
  - `plan` → `opencode/gemini-3.1-pro` (read-only tools)
  - `build` → `opencode/kimi-k2.6` (write / edit / bash enabled)
  - `docs-writer` → `opencode/claude-haiku-4-5` (subagent with write/edit tools, automatically triggered by `build` for documentation updates)

## Git quirks

- `.gitignore` intentionally ignores `package.json`, `bun.lock`, and `.gitignore` itself. `package-lock.json` is the only tracked dependency lockfile.
- Do not add `package.json` or `bun.lock` to git.

## Skills

- Custom skills live under `skills/` (`gh-pr-reviewer`, `so-search`).
- The same skills are mirrored under `.gemini/skills/`. Keep both copies in sync when editing skill content.
- `gh-pr-reviewer.skill` at the root is a bundled zip export of the skill. Regenerate it if the underlying skill files change.
