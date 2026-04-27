---
name: gh-pr-reviewer
description: Performs a comprehensive, security-focused review of a GitHub Pull Request. Use when a user asks to review a PR, check a pull request for security issues, or perform a full pipeline review of a branch.
---

# GitHub PR Reviewer

This skill automates a security-centric review pipeline for GitHub Pull Requests using the `gh` CLI.

## Workflow

1.  **Checkout & Sync**: Use `gh pr checkout <pr-number>` to bring the PR branch local.
2.  **Environment Setup**: Identify the project type (e.g., Node.js, Python) and ensure dependencies are up to date if necessary.
3.  **Local Validation**: Execute the project's test suite and linters to establish a baseline of stability.
4.  **Security Analysis**: Retrieve the diff using `gh pr diff`. Analyze the changes against the [security_checklist.md](references/security_checklist.md).
5.  **Review Submission**:
    *   If issues are found: Use `gh pr review --comment --body "<summary>"` or post specific line comments.
    *   If the PR is secure and passes tests: Use `gh pr review --approve --body "<summary>"`.

## Security Focus Areas

When reviewing the diff, prioritize:
- **Injection Risks**: SQL, NoSQL, Command, and Script injections.
- **Sensitive Data**: Hardcoded secrets, keys, or PII in logs/code.
- **Authentication/Authorization**: Broken access controls or insecure defaults.
- **Insecure Dependencies**: Introduction of known-vulnerable packages.

## Guidelines

- **Conciseness**: Keep review comments actionable and brief.
- **Architecture**: Ensure changes align with the project's modularity and patterns.
- **TDD**: Verify if new features include corresponding tests.
