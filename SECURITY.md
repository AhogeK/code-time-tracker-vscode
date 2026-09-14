# Security Policy

## Supported Versions

As this is a personal open-source project, only the latest version is actively supported. Please ensure you are using
the most recent release.

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please prioritize reporting it privately rather than
opening a public issue. This allows us to address the vulnerability before it can be exploited.

### How to Report

Please email **ahogek@gmail.com**.

In your report, please include:

1. The version of the extension and the VS Code version you are using.
2. A description of the vulnerability.
3. Steps to reproduce the issue (if applicable).

### Response Timeline

We will try to acknowledge your report within 48 hours and will keep you updated on the progress of the fix.

## Scope

This extension stores coding-time data locally. When cloud sync is configured it talks only to a
self-hosted [ctt-server](https://github.com/AhogeK/ctt-server) instance chosen by the user. Reports
about that backend belong to its own repository.

In scope for this repository:

- Credential handling — the API key must only ever be stored in VS Code's encrypted `SecretStorage`
  and must never be written to settings, logs, or telemetry
- Local data handling — session data must not leave the machine unless sync is explicitly enabled
- Extension-host integrity — activation, command registration, and disposal

Out of scope:

- Vulnerabilities in VS Code itself
- Misconfiguration of a user's own ctt-server deployment
- Issues that require an already-compromised local machine
