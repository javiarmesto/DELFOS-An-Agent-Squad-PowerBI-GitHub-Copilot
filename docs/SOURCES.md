# Sources reviewed — 2026-09-24

- Microsoft plugin source: https://github.com/microsoft/skills-for-fabric/tree/65bfb5eb2c488cd03183df88f76ac3de65dcb910/plugins/powerbi-authoring
- Plugin 0.3.17 manifest and powerbi-report-cli dispatcher inspected directly; see [dependency baseline](dependencies.json).
- Power BI agentic overview: https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-agentic-overview
- Authoring MCP and local/hosted boundaries: https://learn.microsoft.com/en-us/power-bi/developer/mcp/power-bi-authoring-mcp
- MCP authoring versus consumption: https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview
- PBIR report authoring: https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview
- Desktop Bridge: https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview
- Typed Power Query tables: https://learn.microsoft.com/en-us/powerquery-m/sharptable
- VS Code agents: https://code.visualstudio.com/docs/agent-customization/custom-agents
- VS Code Local hook protocol: https://code.visualstudio.com/docs/agents/reference/hooks-reference
- Hook harness boundaries: https://code.visualstudio.com/docs/agent-customization/hooks
- Claude plugin layout and agent frontmatter: https://code.claude.com/docs/en/plugins-reference
- Claude subagents: https://code.claude.com/docs/en/sub-agents

Documentation and plugin packaging names can differ during preview. The actual reviewed plugin exposes semantic-model-authoring and powerbi-report-cli, so DELFOS routes through those names instead of assuming each conceptual report stage is a separately installed skill.
