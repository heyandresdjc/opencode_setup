#!/usr/bin/env node

/**
 * Basic secret scanner for diffs.
 * Scans for common patterns of hardcoded keys and tokens.
 */

const fs = require('fs');

const patterns = [
  { name: 'Generic Secret', regex: /secret["']?\s*[:=]\s*["']?[a-zA-Z0-9\-_]{16,}/gi },
  { name: 'Generic API Key', regex: /api[-_]?key["']?\s*[:=]\s*["']?[a-zA-Z0-9\-_]{16,}/gi },
  { name: 'Generic Token', regex: /token["']?\s*[:=]\s*["']?[a-zA-Z0-9\-_]{16,}/gi },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Private Key', regex: /-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----/g }
];

function scanDiff(diffContent) {
  const issues = [];
  const lines = diffContent.split('\n');

  lines.forEach((line, index) => {
    // Only scan added lines in the diff
    if (line.startsWith('+')) {
      patterns.forEach(pattern => {
        if (pattern.regex.test(line)) {
          issues.push({
            pattern: pattern.name,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  });

  return issues;
}

// Read from stdin (piped from gh pr diff)
let input = '';
process.stdin.on('data', data => {
  input += data;
});

process.stdin.on('end', () => {
  const results = scanDiff(input);
  if (results.length > 0) {
    console.log('⚠️ Potential secrets found in PR diff:');
    results.forEach(issue => {
      console.log(`- ${issue.pattern} on line ${issue.line}: ${issue.content}`);
    });
  } else {
    console.log('✅ No obvious hardcoded secrets detected.');
  }
});
