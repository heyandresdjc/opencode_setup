# Project Development Guide

This repository contains the OpenCode configuration, including agent definitions, custom skills, and environment settings.

## Build and Configuration Instructions

This project is a configuration repository and does not require a traditional build process. However, the following configurations are central to its operation:

### 1. Agent Definitions
Agents are defined as Markdown files in the `agent/` directory. Each file contains a YAML frontmatter specifying:
- `model`: The LLM used (e.g., `openrouter/poolside/laguna-m.1`).
- `mode`: The operational mode (`primary` or `subagent`).
- `permissions`: Allowed actions (`edit`, `bash`, `websearch`).

To add or modify an agent, edit the corresponding `.md` file in `agent/`.

### 2. OpenCode Configuration (`opencode.json`)
The `opencode.json` file at the root holds global settings:
- `default_agent`: The agent triggered by default.
- `mcp`: Configuration for Model Context Protocol servers (e.g., Jira, Slack, Playwright).

### 3. Dependency Management
- `package-lock.json` is the source of truth for dependencies.
- **Note**: `package.json`, `bun.lock`, and `.gitignore` are intentionally excluded from Git tracking (as per `.gitignore`). Do not add them.

## Testing Information

Testing in this project primarily involves validating custom skill scripts and agent logic.

### 1. Skill Scripts
Custom skills under `skills/` often include utility scripts (e.g., `scan_secrets.cjs`). These are typically Node.js scripts.

### 2. Guidelines for Adding Tests
When adding new skills or modifying existing ones:
1. Create a reproduction or unit test script (e.g., using `assert`).
2. Verify the script correctly handles both expected and edge-case inputs.
3. Ensure the script interacts correctly with any external CLIs (like `gh`).

### 3. Example Test Process
Below is a demonstration of how to test a skill script (e.g., `skills/gh-pr-reviewer/scripts/scan_secrets.cjs`).

#### Example Test Script (`test_scan.cjs`):
```javascript
const { spawnSync } = require('child_process');
const assert = require('assert');
const path = require('path');

const scriptPath = path.join(__dirname, 'skills/gh-pr-reviewer/scripts/scan_secrets.cjs');

function runTest(diff) {
    const result = spawnSync('node', [scriptPath], { input: diff, encoding: 'utf-8' });
    return result.stdout;
}

// Case: AWS Key detected
const diffWithSecret = '+ const KEY = "AKIA1234567890ABCDEF";';
const output = runTest(diffWithSecret);
assert.ok(output.includes('Potential secrets found'), 'Should detect secret');
console.log('Test Passed: Secret detected correctly.');
```

## Additional Development Information

### Agent Delegation Flow
The project follows a specific architectural delegation:
- `plan` (Lead Architect) → Mandatory review by `reviewer`.
- `build` (Implementer) → Optional delegation to `react-ts-architect` (Frontend) or `docs-writer` (Docs).

### Development Principles
- **TDD (Test Driven Development)**: The `build` agent is instructed to strictly follow TDD.
- **Skill Syncing**: Skills are mirrored under `.gemini/skills/`. Changes to a skill in `skills/` must be synchronized to the corresponding path in `.gemini/skills/`.
- **Skill Exports**: `gh-pr-reviewer.skill` at the root is a zip export. Regenerate it if skill files change.
