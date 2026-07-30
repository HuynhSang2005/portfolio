---
name: agents-md-standard
description: >-
  Design, create, revise, or critique AGENTS.md files as scoped repository
  context for AI coding agents. Use when asked to create AGENTS.md, improve
  existing agent instructions, decide root vs nested AGENTS.md topology for
  monorepos, microservices, monoliths, infra repos, SDKs, or AI-agent projects,
  optimize instructions for context windows and agent usefulness, or separate
  canonical AGENTS.md guidance from tool-specific compatibility files. Do not
  use as a fixed template, workflow runner, audit rubric, or
  vendor-specific config guide.
---

# AGENTS.md Standard

Use this skill to design `AGENTS.md` as repo-local context for AI coding agents. A good `AGENTS.md` gives future agents the local truth they need to edit safely and effectively without guessing.

`AGENTS.md` is not a README replacement, onboarding essay, task checklist, project-management runbook, universal prompt, or vendor config file. It is scoped working context.

## Think in This Order

1. **Topology first**: decide whether the repo needs only root `AGENTS.md` or root plus nested files. Read [references/topology.md](references/topology.md).
2. **Evidence second**: inspect the repo for commands, conventions, architecture boundaries, tools, infra, contracts, and existing docs. Read [references/repo-reading.md](references/repo-reading.md).
3. **Content third**: choose only content categories that change agent behavior. Read [references/content-model.md](references/content-model.md).
4. **Compression last**: remove generic advice, copied docs, stale claims, and tool-vendor assumptions. Read [references/optimization.md](references/optimization.md) and [references/anti-patterns.md](references/anti-patterns.md).

## Source Boundary

Use the official AGENTS.md format and the target repository as the content authority. Tool-specific documentation explains loading behavior only; it must not define what AGENTS.md should contain. Read [references/essence.md](references/essence.md) and [references/portability.md](references/portability.md).

## What to Produce

Produce the smallest useful instruction system for the repo:

- root-only for simple repos.
- root plus nested files when different subtrees need different local context.
- short snippets or fragments when improving an existing file.
- critique with evidence when reviewing a file.

Do not force a section order, grade, or full template. Let the repo shape decide the structure.

## Reference Map

| Need                                       | Read                                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Core definition and source authority       | [references/essence.md](references/essence.md)                                               |
| Project topology and root/nested placement | [references/topology.md](references/topology.md)                                             |
| What content belongs in AGENTS.md          | [references/content-model.md](references/content-model.md)                                   |
| How to inspect repo evidence               | [references/repo-reading.md](references/repo-reading.md)                                     |
| Context-window and quality optimization    | [references/optimization.md](references/optimization.md)                                     |
| What to avoid                              | [references/anti-patterns.md](references/anti-patterns.md)                                   |
| Tool portability and compatibility files   | [references/portability.md](references/portability.md)                                       |
| Good and bad snippets                      | [references/examples.md](references/examples.md), [assets/fragments.md](assets/fragments.md) |

## Final Self-Check

Before delivering, verify:

- every durable claim is supported by repo evidence or explicit user instruction.
- every command, path, tool, script, and config reference is real.
- root content applies broadly; nested content is truly local.
- tool-specific behavior is labeled as compatibility, not standard.
- each line helps an agent work in this repo.
