---
name: so-search
description: Searches Stack Overflow for solutions to programming errors and technical questions. Use when a user provides an error message, reports a bug, or asks for a technical solution that might be found on Stack Overflow.
---

# Stack Overflow Search

## Overview
This skill enables searching Stack Overflow for programming solutions, particularly when troubleshooting specific error messages or seeking technical advice.

## Workflow

1.  **Extract the Query**: Identify the core error message or technical question from the user's input. Remove any project-specific paths or sensitive data from the error string to improve search relevance.
2.  **Search**: Execute the search script to find relevant Stack Overflow questions.
    ```bash
    node scripts/search_error.cjs "your error message or query here"
    ```
3.  **Select Candidates**: Review the results provided by the script. Focus on questions with:
    *   Accepted answers ("Accepted: Yes")
    *   High scores
    *   Titles that closely match the user's problem
4.  **Fetch Content**: Use the `web_fetch` tool to retrieve the content of the top 1-2 most relevant Stack Overflow URLs.
5.  **Synthesize Solution**:
    *   Read the question to confirm it matches the user's context.
    *   Read the accepted or top-voted answers.
    *   Provide the user with a concise summary of the solution, including code snippets if applicable, and explain *why* the solution works.

## Example Usage

**User:** "I'm getting 'TypeError: Cannot read property 'map' of undefined' in my React component."

**Agent Action:**
1.  Run: `node scripts/search_error.cjs "TypeError: Cannot read property 'map' of undefined React"`
2.  Review results and identify a highly-rated question.
3.  Run: `web_fetch --url "https://stackoverflow.com/questions/..."`
4.  Summarize: "This error usually happens when you try to call `.map()` on a variable that hasn't been initialized yet (often while waiting for an API response). You can fix it by adding a check: `data && data.map(...)` or using optional chaining: `data?.map(...)`."

## Resources

### scripts/search_error.cjs
A Node.js script that queries the Stack Exchange API and returns a formatted list of search results.
