import type { Preview } from "@storybook/react-vite";
import { I18nextProvider } from "react-i18next";
import { trackFocusVisible } from "@zag-js/focus-visible";

// Load-bearing, and deliberately BEFORE any story renders. Do not remove.
//
// Storybook 10.5 redefines HTMLElement.prototype.focus as an accessor whose getter runs
// `this.ownerDocument?.defaultView`. Chakra's zag reads `.focus` off the PROTOTYPE
// (@zag-js/focus-visible/dist/index.mjs:73), so `this` is HTMLElement.prototype — not a
// Node — and the native ownerDocument accessor throws "Illegal invocation".
//
// It repeats per zag mount rather than once, because zag's re-entry guard
// `listenerMap.get(getWindow(root))` (index.mjs:68) is only populated at index.mjs:106 —
// AFTER the throwing line 73. The function dies before it can memoize.
//
// Calling it here runs zag's setup while `.focus` is still a plain data property: zag
// captures it, installs its own patch, and seeds listenerMap, so every later zag mount
// takes the guard. Storybook's patch is a LOADER (per-story, at render), so this module
// scope is strictly earlier — the ordering is structural, not luck. The two then compose:
// Storybook reads zag's data property (no getter, no throw) and wraps it, so userEvent
// instrumentation survives. Nothing is suppressed.
//
// Verified by A/B on a cold cache: without this, 22 unhandled errors and exit 1 — with it,
// 6 tests, exit 0. Note the tests PASS either way; only the unhandled errors fail the run.
trackFocusVisible();

// Register the @font-face rules, mirroring _app.tsx. Without these nothing loads the
// actual files, so any machine lacking the fonts locally (e.g. Chromatic's Linux capture
// container) silently falls back to a system font. Keep the weights in sync with
// _app.tsx so Storybook renders what production renders.
import "@fontsource/titillium-web/700.css";
import "@fontsource/mulish/400.css";
// Defines --font-tw / --font-mulish at :root, which is where the theme's font tokens
// resolve them. See the file for why a decorator-level wrapper cannot work.
import "./fonts.css";

import { Provider } from "../src/components/ui/provider";
import i18n from "./i18n";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail the story test on a11y violations
      // 'off'  - skip a11y checks entirely
      //
      // 'error', so a violation fails the run instead of being filed as a TODO nobody
      // is obliged to act on — the same failure class as "typecheck passes on a dead
      // token". Verified rather than assumed: axe flags the tab trigger at 1.83:1 when
      // the tab list sits on v3's default gray-100 (the PR #22 bug).
      //
      // ⚠️ This does NOT gate CI by itself. The upstream comment claiming 'error' =
      // "fail CI" is wrong for this repo: CI runs theme/lint/typecheck/build/
      // build-storybook and NOT vitest (see the NOTE in ci.yml — the browser tests need
      // an optimizeDeps.include fix + `playwright install --with-deps` first). So this
      // only bites where story tests actually run: locally, and in CI once that
      // follow-up lands.
      //
      // The real CI gate is Chromatic's own accessibility tests, which run axe on the
      // Storybook build already uploaded by chromatic.yml and mark the PR unreviewed on
      // a NEW violation (pre-existing ones are baselined). Those must be switched on
      // from the Chromatic project's Manage page — a settings action, not an in-repo
      // one.
      test: 'error'
    }
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Provider>
          <Story />
        </Provider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
