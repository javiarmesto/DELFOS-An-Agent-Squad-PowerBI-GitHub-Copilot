# Installation and capability profiles

## Baseline and prerequisites

- Node.js 18+ for DELFOS scripts and the local MCP launcher; host/CLI packages may require newer versions.
- A current supported VS Code + Copilot or Claude Code installation and its required subscription/authentication.
- Microsoft `powerbi-authoring@fabric-collection`. Reviewed package: **0.3.17**, commit recorded in [dependencies.json](dependencies.json). This is a source-review baseline, not a runtime certification or pin: upstream launches its MCP with `@latest`. Record resolved versions when testing and review upgrades before adopting them in a team.
- Windows and a compatible Power BI Desktop for local rendered verification. Enable the Desktop preview option for external access through secure local APIs and inspect the Bridge manifest. The authoring MCP, report workflow and Bridge remain preview features in the reviewed documentation.
- For Fabric, the appropriate tenant configuration, authentication and model permissions. Write is needed for mutations; Build alone does not grant model editing. Local XMLA access also depends on workspace/capacity configuration. A local-only sample does not need a Fabric workspace.

## VS Code + GitHub Copilot

1. Install the official `powerbi-authoring` agent plugin using VS Code's Agent Customizations/Plugins UI. Add the Microsoft `skills-for-fabric` marketplace if needed; see the [official guide](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-agentic-overview). This is an **agent plugin**, not the separate Modeling MCP VS Code extension.
2. Clone this repository and open it as the workspace, or install DELFOS into an existing project:

```bash
git clone https://github.com/javiarmesto/DELFOS-An-Agent-Squad-PowerBI-GitHub-Copilot.git
cd DELFOS-An-Agent-Squad-PowerBI-GitHub-Copilot
node scripts/install-copilot.mjs "C:/Projects/MyPowerBI" --dry-run
node scripts/install-copilot.mjs "C:/Projects/MyPowerBI"
```

The target must exist. The installer copies DELFOS agents, domain instructions, session prompts, advisory hook and six skills. It refuses differing existing files before writing anything, leaves MCP configuration untouched and does not install plugins or run package downloads. Existing installations need the reviewed migration in [MIGRATION.md](MIGRATION.md).

3. Confirm both official skills and `delfos-workflow` load. Confirm exactly one authoring MCP is active. If an extension previously registered a second local server, disable that registration for this session.
4. Select a DELFOS agent and initialize the target. Agents inherit your selected model and host-enabled tool inventory to avoid stale model IDs or plugin-scoped MCP aliases. Enable only the tools you intend to authorize; DELFOS prompts are not a permission boundary.

The shipped `.github/hooks` configuration targets the VS Code **Local harness**. Copilot Agent Host/CLI has a different hook protocol; do not claim the Local hook works there. Use the workflow's explicit preflight until a separate adapter is tested. Prompt files are also host-dependent. Full DELFOS Copilot CLI support is outside this change.

## Claude Code

Install the Microsoft dependency and DELFOS as separate plugins. In Claude Code:

```text
/plugin marketplace add microsoft/skills-for-fabric
/plugin install powerbi-authoring@fabric-collection
/plugin marketplace add javiarmesto/DELFOS-An-Agent-Squad-PowerBI-GitHub-Copilot
/plugin install delfos@delfos-collection
```

**Before this PR is merged**, the default GitHub marketplace branch does not contain DELFOS. Test the checked-out feature branch locally instead:

```bash
git switch feat/authoring-workflows-claude
claude plugin validate ./plugins/delfos
claude --plugin-dir ./plugins/delfos
```

Install the official Microsoft plugin first. `--plugin-dir` loads DELFOS for that session; it does not install DELFOS persistently. Alternatively add the absolute local checkout path as a marketplace and install from `delfos-collection`. Use one DELFOS load path to avoid duplicate skills/agents.

Start `/delfos:delfos-workflow`. Confirm `/agents` contains six DELFOS agents and `/mcp` shows one authoring server. The main conversation delegates; the Lead Squad subagent plans/reviews and returns. Specialist agents inherit host-approved tools, verify their own MCP connections and load the workflow/reference files from their installed plugin root. Neither agent frontmatter nor DELFOS registers another MCP.

## Profiles

| Profile | Registration | Verification |
|---|---|---|
| Desktop | Official plugin's local server | Same-model DAX plus Bridge rendering on Windows |
| PBIP files | Official plugin's local server or official file workflow | File/schema checks; engine/rendering only when a runtime is available |
| Fabric | Hosted Authoring MCP or local where needed | Same workspace/model readback; local-only transactions/traces unavailable on hosted |

Manual examples are in `config/mcp/`: VS Code uses `servers`, Claude uses `mcpServers`. They are **alternatives**, not additions to the official plugin's registration. To use hosted, disable the plugin's local MCP through your host's server controls and enable only the hosted entry, retaining the official skills. If your host cannot separate skills and MCP, keep the official local route rather than duplicating servers.

Hosted authoring endpoint: `https://api.fabric.microsoft.com/v1/mcp/powerbi/authoring`. It cannot reach local files/Desktop. External clients may require explicit Microsoft Entra app registration because dynamic OAuth registration is not supported; verify auth and session persistence rather than assuming a URL is enough. See [Microsoft setup](https://learn.microsoft.com/en-us/power-bi/developer/mcp/power-bi-authoring-mcp).

The local Authoring MCP is not supported on macOS in the reviewed documentation. Use hosted for Fabric models; a Windows Desktop remains necessary for the described local visual loop. Do not infer Windows Desktop connectivity from a Linux/WSL process without testing that boundary.

## Report CLIs and preflight

Use the installed official report skill's setup reference. At the reviewed baseline:

```bash
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
powerbi-report-author --version
powerbi-report-author doctor
powerbi-desktop --version
powerbi-desktop status
```

These commands install/update external tools; they are not run by DELFOS hooks or its installer. Record the resulting versions. In production/team environments use your reviewed versions rather than silently upgrading.

Before a report edit verify target, source-of-truth and unsaved state. After edits run the official validator, reload only the intended PID, capture screenshots and inspect them. Confirm CLI help/Bridge manifest for the installed version. Never let a reload overwrite newer live model changes with older files.

For a copied Copilot workspace, the limited checker is available as `node .github/hooks/scripts/delfos-validate-project.mjs "<project-folder>"`. The repository-level `scripts/` commands in the development guide run from the DELFOS checkout.
