---
# Agent Registry for ExpressJS Code Review Project
---

# Custom Agents

This document registers all custom agents available in this workspace.

## User-Invocable Agents

These agents are available in the agent picker for direct user invocation.

### ExpressJS Code Review
- **File**: `.github/agents/expressjs-code-review.agent.md`
- **Purpose**: Comprehensive code reviews of ExpressJS applications including code quality, test coverage, and automated fixes
- **Invocation**: Type `/` in chat and select "ExpressJS Code Review"
- **Input**: Folder path or file paths to review, optionally specify focus areas (quality, tests, performance, security)

## Internal Sub-Agents

These agents are NOT user-invocable and are called automatically by the main code review agent.

### Code Review Analysis
- **File**: `.github/agents/code-review-analysis.agent.md`
- **Purpose**: Performs detailed code analysis of ExpressJS applications
- **Scope**: Architecture, design patterns, code quality, best practices, performance
- **Restrictions**: Read-only, no modifications

### Test Case Review
- **File**: `.github/agents/test-case-review.agent.md`
- **Purpose**: Reviews test suites for coverage, quality, and completeness
- **Scope**: Test coverage analysis, gap identification, quality recommendations
- **Restrictions**: Read-only, no modifications

### Apply Fixes
- **File**: `.github/agents/apply-fixes.agent.md`
- **Purpose**: Implements code fixes and improvements based on review findings
- **Scope**: Critical fixes, major improvements, test additions, documentation
- **Restrictions**: Can modify files and tests, no new dependencies without approval

## Workflow

```
User Request
    ↓
ExpressJS Code Review (Main Agent)
    ├→ Code Review Analysis (Sub-Agent)
    ├→ Test Case Review (Sub-Agent)
    └→ Apply Fixes (Sub-Agent)
```

The main agent orchestrates the review process by delegating to specialized sub-agents and consolidating their findings into a comprehensive report.
