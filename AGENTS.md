# Repository guidance

## Project structure

- The Angular application is located in `andreiucm/`.
- Run application-level npm and Angular commands from `andreiucm/`.
- Keep repository-wide configuration at the repository root.

## Angular version and modernization

- Treat `andreiucm/package.json` and its lockfile as the source of truth for the installed Angular version. The project is currently on Angular 21, but it is intended to be upgraded regularly.
- Follow the latest stable Angular patterns supported by the installed version. Consult the project-local Angular skills, Angular CLI MCP guidance when available, and current official Angular documentation before making framework-level decisions.
- Do not introduce APIs from a newer Angular version until the project dependencies have been upgraded to support them.
- Prefer stable modern APIs over deprecated or legacy alternatives. For new forms, prefer Signal Forms once the installed Angular version supports their stable API (Angular 22+). Migrate existing Reactive Forms deliberately rather than as an unrelated rewrite.
- Keep Angular framework, CLI, build tooling, and CDK packages on compatible versions. Perform framework upgrades with Angular's update tooling and migrations, review the relevant release guidance, and verify the application afterward.
- Do not silently upgrade Angular or other major dependencies as part of unrelated work. Keep upgrades explicit and scoped.

## Angular conventions

- Use standalone components; do not introduce NgModules.
- Use inline component templates and inline component styles by default. Create separate template or stylesheet files only when explicitly requested or when a component has become too large to remain maintainable inline.
- Keep one component per TypeScript file.
- Keep one service per TypeScript file.
- Do not place a component and a service in the same file.
- Prefer signals for local reactive state and derived state.
- Use built-in template control flow such as `@if`, `@for`, and `@switch`.
- Preserve zoneless change detection.
- Lazy-load routed page components where appropriate.
- Reuse components from `andreiucm/src/app/shared/components/` before creating parallel alternatives.
- Preserve the existing Tailwind and CSS-variable theming approach.
- Keep code accessible and use semantic HTML and appropriate ARIA behavior for interactive controls.

## Application behavior

- Preserve the existing authentication flow unless a change is explicitly requested.
- Treat `/profile` and `/books` as authenticated routes.
- Do not change deployed backend URLs or API contracts without explicit approval.
- Do not expose authentication tokens, credentials, or other sensitive values.

## Verification

- After application changes, run `npm run build` from `andreiucm/`.
- Run `npm test -- --watch=false` when relevant tests exist, using the test runner configured by the installed Angular version.
- After Angular upgrades, run the applicable Angular migrations, build, and test suite, and inspect migration output for required manual follow-up.
- Report checks that were not run, failed, or remain inconclusive.

## Git policy

- Do not push commits, branches, or tags unless the user explicitly requests a push in the current conversation.
- A request to commit, rebase, merge, prepare a pull request, or finish work does not authorize pushing.
- Before any push, state the branch and remote, then wait for explicit approval.
- Preserve unrelated working-tree changes.
