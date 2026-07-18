# Claude Design source of truth

The **only** authoritative source of redesign design tokens (colors, fonts, spacing)
and layout is the Claude Design project with **ID `3888fdd5-74ed-4b01-9f59-d3c985e1ddde`**.

- **Match on the ID, never the name.** It is currently titled "tylerpweb.dev redesign"
  (renamed 2026-07-15 from "Website redesign proposal"). The name can change; the ID is
  the stable handle. A name-based match silently finds nothing — or the wrong project.
- **Tokens** come from `DesignSystem.dc.html` in that project. **Layout** to build
  against is `Portfolio.dc.html` in the same project.
- **Do not open or consult any other Claude Design project.** A separate "Personal
  website design system" project exists in the same workspace and looks like it could be
  the token source. It is **explicitly out of scope**, even where it appears to overlap.

The `claude-design` MCP server is pinned in `.mcp.json`; verify the ID resolves with
`get_project` before pulling from it. PLAN.md carries the same constraint on its
"Source of truth" line.
