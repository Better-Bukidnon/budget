# Claude Code subagents for this project

28 subagents in `.claude/agents/`, taken unchanged from
[VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
at commit `f2e2ea7` (2026-10-30), MIT licence (copy in `.claude/agents/VOLTAGENT-LICENSE`).
The repository has 165 agents. We took the ones that fit this stack and this kind of
work, because every installed agent's description is loaded into each session. Each file
was checked for network calls and injected instructions before copying.

Project agents override user-level agents with the same name, so the repo behaves the
same on any machine.

| Agent | Model | Use it in this project for |
| --- | --- | --- |
| **Build the portal** | | |
| `react-specialist` | sonnet | React 19 pages and components in `src/bukidnon/` |
| `typescript-pro` | sonnet | API response types, config contract, strictness |
| `frontend-developer` | sonnet | Page assembly, routing, state in the URL |
| `ui-designer` | sonnet | Layout, chart styling, mobile-first patterns within the template theme |
| `node-specialist` | sonnet | `scripts/snapshot.ts`, `check-bukidnon.ts`, paging and backoff |
| `build-engineer` | haiku | Vite config, bundle budget, chunking |
| `dependency-manager` | haiku | Keeping runtime dependencies at the template's three; audits |
| `deployment-engineer` | haiku | GitHub Actions nightly rebuild, Cloudflare Workers deploys |
| **Data** | | |
| `data-analyst` | haiku | Reconciling totals, building trend series, sanity-checking figures |
| `data-researcher` | sonnet | Probing bettergov.ph endpoints, finding dimension codes in statistics.bettergov.ph |
| `api-documenter` | haiku | Keeping `docs/data-sources/` exact when endpoints change |
| **Quality** | | |
| `code-reviewer` | inherit | Reviews before merge |
| `architect-reviewer` | inherit | Checking that additions stay isolated from template files |
| `debugger` | sonnet | Failing checks, API shape changes |
| `test-automator` | sonnet | Vitest for `src/bukidnon/lib/`, Playwright route smoke tests |
| `qa-expert` | sonnet | Test plan per phase |
| `accessibility-tester` | haiku | WCAG 2.2 AA audit of each page |
| `ui-ux-tester` | sonnet | Walking user flows in a real browser |
| `performance-engineer` | sonnet | 3G mobile load, bundle size, snapshot file sizes |
| `security-auditor` | inherit | CSP, the bettergov.ph-only rule, dependency risk |
| **Content and product** | | |
| `product-manager` | haiku | Prioritising features and phases, tracking open decisions |
| `ux-researcher` | sonnet | What residents, teachers and newsrooms need from the portal |
| `ux-microcopy-reviewer` | sonnet | Plain-language labels, empty states, error messages |
| `technical-writer` | haiku | About page, methodology, user help |
| `documentation-engineer` | haiku | Developer docs in `docs/` |
| `docs-drift-editor` | sonnet | Finding docs that no longer match the code |
| `content-quality-editor` | haiku | Final pass on published text |
| `seo-specialist` | haiku | Link previews, page titles, sitemap |

## Adding more

```bash
git clone --depth 1 https://github.com/VoltAgent/awesome-claude-code-subagents /tmp/va
cp /tmp/va/categories/<category>/<agent>.md .claude/agents/
```

Read the file before copying it in. It runs as a prompt with the tools its front matter
lists.
