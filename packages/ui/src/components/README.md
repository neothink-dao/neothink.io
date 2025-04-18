# Shadcn/ui-Only Policy

This directory previously contained custom UI components. As of April 2025, all UI in this monorepo must use only [Shadcn/ui](https://ui.shadcn.com/) primitives for maximum consistency, maintainability, and user delight.

- Do NOT add custom components here.
- Use and re-export only Shadcn/ui primitives from `../ui/`.
- If you need a custom component, build it as a thin wrapper around Shadcn/ui primitives and place it in your app, not in this shared package.

For questions, see the monorepo documentation or contact the admin team.
