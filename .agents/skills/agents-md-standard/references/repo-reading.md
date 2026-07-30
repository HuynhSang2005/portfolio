# Repo Reading

Read enough of the repository to identify agent-relevant context. Do not inventory the repo for its own sake.

## Evidence Sources

Inspect likely sources:

- existing instruction files: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules`, or local equivalents.
- manifests and lockfiles.
- task runners and script files.
- CI workflows.
- README, CONTRIBUTING, SECURITY, docs, ADRs, specs.
- source and test layout.
- config files, env examples, infra directories.
- generated-file markers and schema or API files.
- MCP, agent, prompt, eval, or skill directories when present.

## Reading Questions

Ask:

- What topology does this repo use?
- What commands would an agent need most?
- What areas are risky to edit without local context?
- What conventions are visible and non-obvious?
- What docs should be routed to rather than copied?
- What tool-specific instruction files already exist?

## Command Evidence

Before writing a command, know:

- where it is defined.
- where it should be run.
- what scope it checks.
- whether it is safe locally.
- whether it requires services, secrets, or production access.
- whether a narrower command exists.

## Stop Rule

Stop reading when you can support every proposed durable instruction with repo evidence. Unknowns go in the final response, not into AGENTS.md as guesses.
