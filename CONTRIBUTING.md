# Contributing to Delfos Power BI Agentic Squad

Thank you for your interest in contributing to Delfos! This guide will help you understand how the project is organized and how to submit quality contributions.

## How Delfos Is Organized

Delfos has three content types, each with its own structure and purpose:

### Agent Modes (`.github/agents/*.agent.md`)

Agent modes are specialized AI personas with deep domain expertise. Each agent file follows this structure:

```yaml
---
description: "One-line description of the agent's expertise"
name: "Agent Display Name"
model: Claude Opus 4.6 (copilot)
tools: [list, of, enabled, tools]
---
```

Followed by structured sections covering core responsibilities, best practices, patterns, anti-patterns, and a consistent response structure.

### Instructions (`.github/instructions/*.instructions.md`)

Instructions are always-on guidelines applied by file pattern. Each instruction file includes:

```yaml
---
description: 'Brief description of what the instruction covers'
applyTo: '**/*.{file,extensions}'
---
```

Followed by comprehensive best practices, code examples, and validation checklists.

### Skills (`.github/skills/*/SKILL.md`)

Skills are on-demand prompt templates for specific tasks. Each skill includes an analysis framework, step-by-step process, example output format, and usage instructions.

## Contribution Types

### Adding a New Agent Mode

1. Create a new file in `.github/agents/` following the naming convention: `power-bi-[domain]-expert.agent.md`
2. Include the YAML frontmatter with description, name, model, and tools
3. Follow the established section structure: Core Responsibilities → Best Practices → Patterns → Anti-Patterns → Response Structure
4. Reference `microsoft.docs.mcp` for documentation lookups
5. Include practical code examples (DAX, Power Query, PowerShell, etc.)

### Adding a New Instruction Set

1. Create a new file in `.github/instructions/` following: `power-bi-[topic]-best-practices.instructions.md`
2. Define the `applyTo` pattern carefully — it should match only relevant file types
3. Focus on actionable guidelines with clear ✅ DO and ❌ DON'T patterns
4. Include real-world code examples, not abstract descriptions
5. Add validation checklists where appropriate

### Adding a New Skill

1. Create a new directory under `.github/skills/` with a descriptive name
2. Add a `SKILL.md` file with YAML frontmatter (name, description)
3. Structure the skill as: Analysis Framework → Process Steps → Output Format → Usage Instructions
4. Keep skills focused on a single, well-defined task

### Improving Existing Content

- Fix inaccuracies or outdated Microsoft guidance
- Add missing patterns or anti-patterns
- Improve code examples with real-world scenarios
- Enhance documentation clarity
- Add cross-references between related agents/instructions/skills

## Quality Standards

### Code Examples

All code examples must be syntactically correct and follow the established patterns:

- **DAX**: Use variables, proper reference syntax, DIVIDE for division
- **PowerShell**: Include error handling and parameterization
- **TypeScript**: Follow Power BI visuals SDK patterns
- **YAML**: Valid pipeline configurations

### Microsoft Alignment

Every recommendation must trace back to official Microsoft documentation. When adding new content, include references to the specific Microsoft Learn articles that support the guidance.

### Consistency

- Follow the existing formatting and section structure
- Use the same checkbox styles (✅ ❌ □) for checklists
- Maintain consistent code block annotations
- Keep the same level of detail across similar content types

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-power-query-agent`
3. Make your changes following the standards above
4. Test that agent modes load correctly in VS Code with GitHub Copilot
5. Submit a Pull Request with a clear description of what you added or changed

## Reporting Issues

If you find inaccuracies, missing coverage, or have suggestions for new agents/instructions/skills, open an issue with:

- **Content type**: Agent, Instruction, or Skill
- **Description**: What's wrong or what's missing
- **Microsoft reference**: Link to the official documentation (if applicable)
- **Proposed solution**: How you'd fix or add the content

## Code of Conduct

Be respectful, constructive, and focused on making Power BI development better for everyone. This is an open-source community project — contributions of all sizes are welcome.

---

Questions? Reach out via [GitHub Issues](https://github.com/youruser/delfos-powerbi-agentic-squad/issues) or find me on [LinkedIn](https://www.linkedin.com/in/javierarmesto/).
