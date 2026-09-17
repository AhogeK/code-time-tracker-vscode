# Changelog

All notable changes to the Code Time Tracker VS Code extension are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-09-17

### Added

- Vendored the ctt-server language vocabulary (`src/language/vocabulary.json`, v2:
  842 canonical languages / 489 aliases / 76 non-language values) so local statistics can
  merge languages the same way the server does. The file is kept byte-identical to the
  server's copy; its sha256 is pinned by `src/test/vocabulary.test.ts`.
- `resolveJsonModule` in `tsconfig.json`, so the vocabulary can be imported and esbuild
  inlines it into the bundle.

## [0.1.0] - 2026-09-14

Project foundation. No tracking behaviour yet — this release establishes the
repository, toolchain, and community baseline.

### Added

- Extension scaffold targeting VS Code `^1.137.0`, with the
  `code-time-tracker-vscode.helloWorld` command as an activation smoke test
- Toolchain: TypeScript strict mode, esbuild bundling, ESLint flat config, and
  Mocha via `@vscode/test-cli`
- Editor and commit conventions: `.editorconfig`, `.gitmessage`, `.gitignore`
- Community files: MIT `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  and `SECURITY.md`
- Project `README.md` describing scope, requirements, and milestones

[Unreleased]: https://github.com/AhogeK/code-time-tracker-vscode/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/AhogeK/code-time-tracker-vscode/releases/tag/v0.1.1
[0.1.0]: https://github.com/AhogeK/code-time-tracker-vscode/releases/tag/v0.1.0
