# Topology

Choose the instruction topology before writing content. The goal is to place context where it applies.

## Core Rule

Root `AGENTS.md` holds broad truths. Nested `AGENTS.md` files hold local truths. Do not create nested files just to organize topics.

## Project Models

| Project model      | Recommended instruction topology                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Small repo         | One short root `AGENTS.md`.                                                                                                            |
| Monolithic app     | Root file; optional nested files for high-risk areas such as infra, migrations, generated code, or security.                           |
| Modular monolith   | Root invariants plus nested files for bounded contexts or modules with distinct rules.                                                 |
| Monorepo           | Root map and workspace rules plus nested files for apps, packages, services, or libraries with different commands or contracts.        |
| Microservices repo | Root service map and shared rules plus service-level `AGENTS.md` where workflows diverge.                                              |
| Infra repo         | Root safety posture plus nested files for Terraform, Kubernetes, Helm, Docker, or operations areas when risk differs.                  |
| SDK or library     | Root focus on public API, compatibility, tests, release, generated docs, and versioning contracts.                                     |
| AI-agent repo      | Root context plus local guidance for prompts, evals, traces, MCP servers, skills, model providers, or agent runtimes when those exist. |

## When to Add a Nested File

Add nested `AGENTS.md` only when a subtree has one or more of:

- different commands or package manager.
- different test runner, fixtures, or build process.
- generated outputs, schemas, migrations, or public contracts.
- different architectural rules or dependency boundaries.
- different infra or safety requirements.
- agent-specific assets such as prompts, evals, MCP config, or skills.

## When Not to Add One

Do not add nested files for:

- generic language advice.
- topic organization detached from directory scope.
- repeated root instructions.
- a single small note that belongs as one root bullet.

## Root as Router

In large repos, root can route agents to the right places:

- where packages or services live.
- how to identify the current workspace.
- where nested `AGENTS.md` files exist.
- which docs to read for cross-cutting work.
- which root-level commands are safe and canonical.
