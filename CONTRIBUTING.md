# Contributing to Code Time Tracker for VS Code

Thanks for your interest in improving this extension. This guide covers how to set up the project,
what the code conventions are, and how to get a change merged.

## Prerequisites

- **Node.js** 20.x or later
- **pnpm** 10 or later (`npm install -g pnpm`)
- **VS Code** 1.137.0 or later (needed to run the extension host for manual checks)

## Development Setup

```bash
# Clone and install
git clone https://github.com/AhogeK/code-time-tracker-vscode.git
cd code-time-tracker-vscode
pnpm install
```

### Running the extension

Press `F5` in VS Code. This starts the watch build and opens an **Extension Development Host** —
a second VS Code window with the extension loaded. The command palette entry
`Hello World` confirms it activated.

Set breakpoints in `src/**` as usual; source maps are enabled in development builds.

### Available commands

| Command | What it does |
| --- | --- |
| `pnpm run compile` | Type check + lint + bundle. **Run this before every commit.** |
| `pnpm run check-types` | `tsc --noEmit` only |
| `pnpm run lint` | `eslint src` only |
| `pnpm run watch` | Parallel watch builds (what `F5` uses) |
| `pnpm run package` | Production bundle (minified, no source maps) |
| `pnpm test` | Runs the test suite in a real VS Code instance |

## Code Style

The project uses TypeScript with `strict` enabled and ESLint. Conventions:

- **Language** — code, comments, and commit messages are English
- **Naming** — `PascalCase` for types, `camelCase` for functions and variables,
  `UPPER_SNAKE_CASE` for constants, `kebab-case` for file names
- **No `any`** — use `unknown` and narrow it, or write a proper type
- **Comments** — explain *why*, not *what*. Public APIs get JSDoc; obvious code gets nothing
- **Disposables** — every command, listener, and event subscription must be pushed to
  `context.subscriptions`. A listener that outlives `deactivate()` keeps its closure alive and slows
  down every window that had the extension active
- **No blocking work on the extension host** — the host shares the UI thread. Use async I/O; move
  heavy computation off the main path
- **Secrets** go in `context.secrets`, never in `settings.json`, `globalState`, or logs

Formatting is enforced by ESLint (`curly`, `eqeqeq`, `semi`, `no-throw-literal`, naming rules).
Run `pnpm run lint` and fix what it reports.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). Enable the template once
per clone:

```bash
git config commit.template .gitmessage
```

Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types** — `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
`revert`

**Subject** — imperative mood ("add" not "added"), no trailing period, max 72 characters

**Body** — explain *what* changed and *why*, wrapped at 72 characters. Include the root cause and
the verification for a bug fix.

Examples:

```
feat(tracker): split sessions on idle timeout

fix(storage): drop degenerate sessions before aggregation

A session whose endTime equals its startTime contributes zero seconds and is
skipped by every statistics endpoint. Filter them at write time so the count
in the local view matches the server's.

Verified by re-running the aggregation suite against a seeded store.
```

Do not add AI attribution, co-author trailers, or "generated with" footers.

## Pull Requests

1. Branch from `develop`, not `master`.
2. Use a descriptive branch name — `feat/<short-desc>`, `fix/<short-desc>`,
   `docs/<short-desc>`, `refactor/<short-desc>`.
3. Keep each commit atomic: one coherent change per commit.
4. Before opening the PR, confirm `pnpm run compile` passes and you have manually exercised the
   changed behaviour in the Extension Development Host. Type checking alone does not prove a VS Code
   integration works — activation timing, event delivery, and disposal are invisible to `tsc`.
5. Open the PR against `develop` and describe **what** changed, **why**, and **how you verified it**.
6. Link the issue it closes, if there is one.

`master` is the release branch and stays clean of work-in-progress. Maintainers cherry-pick released
changes across.

## Reporting Bugs

Open an issue and include:

- Extension version (from the Extensions view) and VS Code version (`Help → About`)
- Operating system
- What you expected, what happened, and the steps to reproduce
- Any error text from **Output → Code Time Tracker**, and from **Help → Toggle Developer Tools →
  Console** if the extension failed to activate

## Feature Requests

Open an issue describing the problem you want solved rather than a specific implementation. Knowing
the underlying need usually leads to a better answer than the first design.

## Data and Privacy

This extension keeps coding-time data on your machine. Cloud sync is opt-in and talks only to a
ctt-server instance you host yourself. Never include real API keys or personal session data in an
issue or a PR — redact them.

## Security

Please do not report vulnerabilities in public issues. See [SECURITY.md](SECURITY.md).

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating you agree to
abide by its terms.

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
