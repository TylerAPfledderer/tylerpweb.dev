# Local dev server

**Use `bun run dev:incognito` as the primary local dev script.** It starts `next dev`,
waits for `http://localhost:3000` to respond (via ephemeral `bunx wait-on` — no dependency
added), then opens the site in a fresh Chrome incognito window.

Incognito is the default so local runs are unaffected by extensions, cached service
workers, or prior session state — the site is seen the way a first-time visitor sees it.

## Notes

- `bun run dev` (plain `next dev`, no browser) remains available for headless/CI-style runs.
- Chrome is hardcoded to the Windows binary
  (`/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`) — the only Chrome that
  renders under this WSL2 setup. Not portable to non-WSL machines.
- `wait-on` is invoked via `bunx`, so it is **not** a project dependency and needs no
  approval under `dependencies.md`. First run does a one-time network fetch.
