# Security Review Checklist

Use this checklist to identify potential vulnerabilities in the PR diff.

## 1. Input Validation & Injection
- [ ] **SQL Injection**: Are raw strings used in database queries? (Check for ORM usage or parameterized queries).
- [ ] **Command Injection**: Does the code execute shell commands with user-controlled input?
- [ ] **XSS (Cross-Site Scripting)**: Is user input rendered in HTML without escaping?
- [ ] **Regex Denial of Service (ReDoS)**: Are complex regexes applied to untrusted, long strings?

## 2. Authentication & Session Management
- [ ] **Hardcoded Secrets**: Search for API keys, tokens, or passwords in code or config files.
- [ ] **Weak Hashing**: Are passwords hashed with legacy algorithms (MD5, SHA1)?
- [ ] **Session Fixation**: Are session IDs regenerated after login?

## 3. Sensitive Data & Privacy
- [ ] **Information Leakage**: Does the code log sensitive data (PII, tokens, credit card numbers)?
- [ ] **Insecure Storage**: Is sensitive data encrypted at rest?
- [ ] **Path Traversal**: Can user input influence file paths (e.g., `../../etc/passwd`)?

## 4. Dependencies & Infrastructure
- [ ] **Vulnerable Packages**: Did the PR add dependencies with known CVEs?
- [ ] **Insecure Defaults**: Are new cloud resources or services configured with "Allow All" permissions?

## 5. Logic & Authorization
- [ ] **IDOR (Insecure Direct Object Reference)**: Can a user access another user's data by guessing an ID?
- [ ] **Race Conditions**: Is shared state handled safely in asynchronous or multi-threaded contexts?
