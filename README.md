# Code Time Tracker for VS Code

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.137.0%2B-blue.svg)](https://code.visualstudio.com/)

Automatic coding-time tracking and analytics for Visual Studio Code.

Part of the **Code Time Tracker** family — a VS Code extension sharing the
[ctt-server](https://github.com/AhogeK/ctt-server) backend and the
[ctt-web](https://github.com/AhogeK/ctt-web) dashboard with the
[JetBrains plugin](https://github.com/AhogeK/code-time-tracker).

> **Status: early development.** The extension is a scaffold at `v0.0.1` — it activates and
> registers its commands, but tracking and statistics are not implemented yet. Follow the
> milestones below, or watch the repository for the first functional release.

## Why this exists

The JetBrains plugin tracks coding time where JetBrains IDEs run. This project brings the same idea
to VS Code, and reports into the same account so a developer who uses both IDEs sees one unified
picture in the web dashboard.

## Planned features

- **Automatic tracking** — records coding activity without manual input, with idle detection so
  time away from the keyboard is not counted
- **Local-first storage** — session data lives on your machine
- **Status bar timer** — today / this week / this month / this year, updated live
- **Statistics view** — project, language, and time-of-day breakdowns inside the editor
- **Optional cloud sync** — connect a self-hosted ctt-server to sync sessions across devices, so
  VS Code and JetBrains data land in the same account

## Requirements

- **VS Code** 1.137.0 or later
- **ctt-server** *(optional)* — only needed for cloud sync. Local tracking does not require it.

## Development

```bash
pnpm install
pnpm run compile   # type check + lint + bundle

# press F5 in VS Code to launch an Extension Development Host
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full setup, conventions, and PR process.

## Project layout

```
src/
├── extension.ts          # activate / deactivate entry point
└── test/                 # Mocha tests, run inside a real VS Code host
dist/                     # bundled output (generated)
```

## Related repositories

| Repository                                                            | Role                                          |
| --------------------------------------------------------------------- | --------------------------------------------- |
| [ctt-server](https://github.com/AhogeK/ctt-server)                    | Backend — sync, statistics, leaderboard       |
| [ctt-web](https://github.com/AhogeK/ctt-web)                          | Web dashboard                                 |
| [code-time-tracker](https://github.com/AhogeK/code-time-tracker)      | JetBrains plugin                              |
| **code-time-tracker-vscode**                                          | VS Code extension (this repository)           |

## Milestones

- [x] Repository initialized
- [ ] Local tracking core — activity capture, idle detection, session splitting
- [ ] Statistics and status bar
- [ ] Local storage layer
- [ ] Cloud sync with ctt-server

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and note that this
project is released with a [Code of Conduct](CODE_OF_CONDUCT.md) — by participating you agree to
abide by its terms.

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md).

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

**Maintainer**: AhogeK · **GitHub**: [@AhogeK](https://github.com/AhogeK) ·
**Website**: [ahogek.com](https://www.ahogek.com)

<div align="center">

## 💖 Support This Project

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=plastic&logo=ko-fi&logoColor=white)](https://ko-fi.com/ahogek)
&nbsp;&nbsp;
[![Afdian](https://img.shields.io/badge/爱发电-946ce6?style=plastic&logo=github-sponsors&logoColor=white)](https://afdian.net/a/AhogeK)
&nbsp;&nbsp;
[![Solana](https://img.shields.io/badge/Solana-14F195?style=plastic&logo=solana&logoColor=white)](https://solscan.io/account/55XnqvGKwH6LamJB7tSwUbrmJikEU2zwP3k1FjsdyEys)

<p align="center">
Made with ❤️ for developers who value your time
</p>

</div>
