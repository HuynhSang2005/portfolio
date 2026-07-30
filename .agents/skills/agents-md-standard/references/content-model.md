# Content Model

Choose content by agent usefulness, not by required sections.

## Core Categories

- **Identity**: what the repo builds and the primary runtime or product surface.
- **Topology**: key packages, services, modules, apps, libraries, infra areas, and nested instruction locations.
- **Tech stack**: frameworks and languages only when they affect commands, conventions, or edit safety.
- **Tools and scripts**: package manager, task runner, test runner, codegen, formatter, linter, typechecker.
- **Infra and settings**: Docker, compose, Terraform, Kubernetes, env files, feature flags, secret boundaries.
- **Rules and conventions**: local code patterns, naming, import boundaries, module ownership, fixture rules.
- **Architecture and principles**: dependency direction, layering, domain boundaries, API shape, public contracts.
- **Generated and contract surfaces**: schemas, migrations, generated clients, snapshots, API specs, SDK outputs.
- **MCP, agents, and skills**: only when the repo actually contains MCP servers, agent skills, prompts, evals, traces, or model/provider config.
- **Verification**: commands and checks agents should run, with scope and run location when useful.
- **Related docs**: docs linked by need, not copied.

## Include When

Include a category when it prevents likely wrong edits, wrong commands, unsafe operations, or wasted context exploration.

## Omit When

Omit a category when:

- the repo evidence is weak.
- the fact is obvious from local files.
- it is generic programming advice.
- a linked doc is a better home.
- it applies only to a subtree that should have nested instructions.

## Principle Rule

Principles belong only when they are real project decisions, such as dependency direction or compatibility promises. Do not include broad values like "prefer clean code".
