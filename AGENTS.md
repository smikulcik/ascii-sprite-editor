# Agentic Interaction Guide - ASCII Sprite Editor

This document outlines how AI agents should interact with this codebase to ensure consistency and maintainability.

## Spec-Driven Development

All new features or major refactorings should start with a specification in the `specs/` directory (or updating this file).
- Define the objective.
- Outline the technical design.
- Specify the verification criteria.

## Process Workflow

1.  **Understand**: Read the current state of the codebase.
2.  **Plan**: Propose changes in an `plans/implementation_plan.md`.
3.  **Execute**: Implement changes in small, logical steps.
4.  **Verify**: Run tests or manual verification steps.

## Technical Standards

- **Language**: TypeScript only.
- **Linter**: ESLint (strictly followed).
- **Architecture**: Electron (Main/Renderer separation).
- **Styling**: Tailwind CSS.

## Communication

- Use `task_boundary` to communicate progress.
- Use `notify_user` for planning approval and major updates.

## Coding Interactions

- Always use conventional commits
- After generating sufficient scopes of work, suggest to commit the changes
  - make sure to summarize what files were changed and why
