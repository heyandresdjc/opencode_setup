# Agent Notes

This repo is the personal OpenCode configuration at `~/.config/opencode`. It is not an application—there is no build, test, or lint pipeline.

## Source of truth

Agents are defined in markdown files under the `agent/` directory. The `opencode.json` file only holds `default_agent`, `lsp`, and `mcp` configuration.

### Agent Definitions

| Agent | Model | Mode | Purpose |
|-------|-------|------|---------|
| `plan` | `openrouter/z-ai/glm-5.2` | primary | Lead architect, read-only planning with mandatory reviewer validation |
| `build` | `openrouter/poolside/laguna-m.1` | primary | TDD implementer with write/edit/bash permissions |
| `reviewer` | `openrouter/qwen/qwen3.7-plus` | subagent | Code/architecture review, read-only |
| `docs-writer` | `openrouter/mistralai/mistral-small-2603` | subagent | Technical documentation generation |
| `react-ts-architect` | `openrouter/nvidia/nemotron-3-ultra-550b-a55b` | subagent | React/TypeScript advisory (no file writes) |
| `security-auditor` | `openrouter/qwen/qwen3.7-plus` | subagent | Security-focused code audit |
| `tech-researcher` | `openrouter/deepseek/deepseek-v4-pro` | all | Skeptical technology research and integration guides |

### Delegation Flow

- `plan` → mandatory → `reviewer` (architectural validation)
- `build` → optional → `react-ts-architect` (for frontend changes)
- `build` → optional → `docs-writer` (for documentation updates)
- `build` → optional → `tech-researcher` (for technology research)

## Git quirks

- `.gitignore` intentionally ignores `package.json`, `bun.lock`, and `.gitignore` itself. `package-lock.json` is the only tracked dependency lockfile.
- Do not add `package.json` or `bun.lock` to git.

## Skills

- Custom skills live under `skills/` (`gh-pr-reviewer`, `so-search`, `graphify`, `prd-reviewer`).
- The same skills are mirrored under `.gemini/skills/`. Keep both copies in sync when editing skill content.
- `gh-pr-reviewer.skill` at the root is a bundled zip export of the skill. Regenerate it if the underlying skill files change.