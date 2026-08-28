import { addons } from "storybook/manager-api";

// Oversight's options cannot travel through main.ts — addon options don't reach the
// manager bundle — so its panel is configured here. (The Docs block reads a separate
// channel: `parameters.oversight` on a component's own stories meta.)
addons.setConfig({
  "storybook-addon-oversight": {
    // Must equal `typescript.reactDocgen` in main.ts. That pairing is the whole point:
    // `extractor-drift` only runs when an expectation is configured, and it is the one
    // rule that catches the extractor being switched to something that extracts nothing —
    // a change `build-storybook` reports as "completed successfully". See the long note in
    // main.ts for why react-docgen-typescript is not the value here.
    expectedExtractor: "react-docgen",
  },
});
