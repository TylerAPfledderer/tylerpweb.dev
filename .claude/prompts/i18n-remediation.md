# Prompt — i18n remediation (PR2 follow-up, approval-gated)

> Paste this into a fresh Claude Code session on `tylerpweb.dev`. It assumes
> `.claude/rules/i18n.md`, `branch-safety.md`, and `dependencies.md` are loaded.

---

## Context

A full audit of `public/locales/**` (13 locales × 3 namespaces) found the 12 non-`en`
locales are machine-translated, unreviewed, and structurally stale against the redesigned
`en` source. Three defect classes:

1. **Structural drift** — every non-`en` locale is missing 17 `common` keys, carries 6
   orphan keys, and has `project-item-card-github` where `en` now has
   `project-item-card-source`.
2. **Broken interpolation** — `hero-site-title` and `about-title` lost their `<0>`/`<1>`
   component tags in all 12; `projects-tab-open-source` gained a `<0>` tag `en` doesn't
   have; `fi` has an unclosed tag; `uk` has empty tags with the content deleted.
3. **Mistranslation** — including meaning inversions, corrupted proper nouns, one string
   in the wrong language, and two locales using a word with a WWII-collaborator
   connotation.

This work is **PLAN.md approval checkpoint #4** (Crowdin re-sync — external, published).
It was deliberately carved out of the PR2 run.

## Hard constraints — read before doing anything

- **Never hand-edit `public/locales/<non-en>/*.json`.** Those files are Crowdin build
  output. A local edit is silently reverted on the next `crowdin download` and creates a
  false green. Every translation fix lands **in Crowdin**, then comes back via download.
  The only file you edit by hand is `public/locales/en/*.json`.
- **No `crowdin upload` / `crowdin download` / locale change without Tyler's explicit
  approval, obtained at the moment of the call.** Read-only Crowdin commands
  (`status`, `list`, glossary/QA reads) need no approval — use them freely.
- **Do not sync to Crowdin before the redesign has Tyler's visual sign-off** (checkpoint
  #6). The `en` copy is still moving; uploading a moving source burns translator effort.
- Branch from `modernize-updates`, not `main`. Anything under `public/locales/` or
  `package.json` goes through a **PR**, never a direct push.
- You are not the authority on Finnish, Ukrainian, or Japanese quality. Your job is to fix
  the source, make the defects *machine-detectable*, and stage the human review — not to
  hand-write 12 languages.

## Tooling

`@crowdin/cli` is pre-cleared as a devDep (PLAN.md checkpoint #2) but **not yet
installed**. For Phase A/B recon use `bunx @crowdin/cli@4 …` — ephemeral, no dep add, same
pattern as `wait-on` in `dev-server.md`. Only add the devDep when you reach Phase D and
need it in a script.

`crowdin.yml` already maps `/public/locales/en/*.json` →
`/public/locales/%two_letters_code%/%original_file_name%`. Auth is env-only:
`CROWDIN_PERSONAL_TOKEN` + `CROWDIN_PROJECT_ID`. If either is unset, **stop and tell
Tyler** — do not invent a config block or write credentials into `crowdin.yml`.

---

## Phase A — `en` source hygiene (in-repo, no approval, do this first)

The audit showed the same handful of source strings defeating every MT engine. Fix the
source before re-translating, or you buy the same bugs in 12 languages again.

1. **`common.json` → `about-card-code-desc`** contains `"Open source is my jam! 🤘"`.
   Ten of twelve locales rendered *jam* as the fruit preserve (`Marmelade`, `mermelada`,
   `dżem`, `джем`, `ジャム`). It is untranslatable as written. Propose 2–3 replacements that
   keep the register but survive translation, and **ask Tyler to pick** — this is copy, and
   copy is checkpoint #6. Do not silently rewrite it.
2. **`A11y`** appears bare in the same string. No engine resolves it; `da`, `sv`, and `fi`
   each guessed differently ("handicap-friendliness", "assistive devices", "availability").
   Expand it to `accessibility` in the source and let the numeronym live in the design, not
   the string.
3. Audit the remaining `en` strings for the same failure mode — idiom, jargon, or a bare
   abbreviation with no context. Known repeat offenders in this copy: *bring your project
   to fruition*, *dang*, *community college*, *lead developer*, *vanilla HTML*,
   *backward-compatible*, *mixins*, *responsive*, *PRs*. Do not remove them from the copy;
   flag them for Phase B context notes.
4. Confirm `project-item-weatherapp-description` in `en` is the corrected weather copy and
   not the Cloudflare copy-paste. (It is, as of this writing — verify, don't assume.)

Deliverable: a PR against `modernize-updates` touching only `public/locales/en/*.json`,
plus a short list in the PR body of what changed and why.

## Phase B — make the defects machine-detectable (in-repo + read-only Crowdin)

Every defect the audit found by hand should fail a check next time.

1. **Add `scripts/i18n-verify.ts`** and a `bun run i18n:verify` script. It must fail
   non-zero on any of:
   - a key in `en` missing from a locale, or a key in a locale absent from `en`;
   - an ICU/i18next placeholder set mismatch — compare the sorted multiset of
     `{{…}}` and `<N>`/`</N>` tokens per key against `en`;
   - a malformed tag: an opening `<N>` without a matching `</N>` (this is exactly the
     `fi` `projects-tab-open-source` bug), or a tag pair with empty content (the `uk`
     bug);
   - an empty or whitespace-only value.
   Report **identical-to-`en`** values as a warning, not a failure — `Demo`, `Copyright`,
   and some product names are legitimately identical, but `da`'s untranslated
   `"UI / UX Developer"` and `sv`'s `"Skills Learned My Journey"` are not, so a human
   should see the list.
2. **Wire it into CI** as its own job in the existing workflow. `.github/workflows/*`
   requires a PR — same PR is fine.
3. **Read Crowdin's current QA settings** (read-only). Confirm these checks are on for the
   project, and report to Tyler which are not: placeholder/tag mismatch, empty
   translation, inconsistent Do-Not-Translate terms, and spelling. The `fi` and `uk` tag
   defects should have been caught server-side and were not.

## Phase C — glossary and Do-Not-Translate (Crowdin, read-only until the write step)

Most of the damage was product names and false friends. Both are glossary problems.

1. Draft a **Do-Not-Translate** term list. Non-negotiable entries, each with the exact
   observed corruption so the reason is legible:

   | Term | Observed corruption |
   |---|---|
   | `Tyler Pfledderer` | `es` "Tyler Pederer", `fi` "Tyler Paloderer", `ja` "タイラーPfledダラー" |
   | `Chakra UI` | `es`/`pl` split it into "the NextJS user interface … and Chakra" |
   | `Styled Components` | translated as a common noun in `de`, `pt`, `uk`, `sv` ("stacked components") |
   | `Github` | `fi` "Jättiläislähde" — *giant source* |
   | `Cloudflare` | truncated to "Cloudf" (`es`), "Cloud" (`uk`) |
   | `React` | `fi` "Reaktin peruskirjasto" |
   | `Ark UI` | `fi` collapsed it to "Vue UI UI UI UI" |
   | `Coffeeroaster` | `pl` "trumien" (*coffins*), `ja` "コーヒー・エバスター", `uk` "Coffeeraster" |
   | `NextJS`, `TypeScript`, `GraphQL`, `Vuex`, `SASS`, `Flexbox`, `StorybookJS`, `Shrtcode`, `Ethereum.org`, `Vue`, `Impact Gift` | assorted |

2. Draft **glossary entries with translator notes** for the terms that are translatable but
   were consistently mistranslated. Each note states the intended sense:
   - *contributions* (open-source sense) — became "payments" (`fi`), "shares" (`fi`),
     "elements being brought in" (`pl`), "membership dues" (`pl`)
   - *collaborator* — **must not** render as `Kollaborateur` (`de`) or `collaborateur`
     (`nl`); both carry the WWII collaborate-with-the-occupier meaning. Note this
     explicitly. Also became "compatible with" (`uk`), "Author" (`uk`),
     "collaboration function" (`sv`)
   - *power contributor* — "electrical power supply" (`uk`), "participant in electrical
     current" (`nl`), "energy contributor" (`pt`)
   - *lead developer* — `pt` "desenvolvedor de chumbo" (*lead, the metal*), `uk`
     "провідник" (*train conductor*)
   - *mixins*, *responsive*, *backward-compatible*, *vanilla HTML*, *stack*,
     *community college*, *small business center*, *migrations* (`fi` gave
     "migreeniä" — *migraines*), *bring to fruition*, *PRs* (keep as `PR`; `fr` gave
     "DA", `sv` gave "IR")
   - *critical thinking* — split across the hyphen in `it`, `pt`, `pl`; `nl` produced
     "my skills criticize thinking"
3. Present the drafted lists to Tyler. **Uploading them is a Crowdin write — gated.**

## Phase D — the re-sync itself (fully gated, one approval per external call)

Do not start this before Phase A's copy decision and checkpoint #6 sign-off.

1. `crowdin status` (read-only) — capture the current translated/approved percentages per
   locale as a baseline, and put them in the PR body.
2. **Ask for approval**, then `crowdin upload sources`. Expect near-total re-translation:
   PR2 adopted the design's rewritten copy as the new `en` source, so this is not a
   new-keys-only delta. Budget for that churn (PLAN.md says the same).
3. Handle `project-item-card-github` → `project-item-card-source` as a **new key, not a
   rename**. TM will happily suggest the old "Github source" translation, but the `en`
   string is now just `Source` — accepting the TM hit reintroduces the defect in 12
   locales.
4. Delete the 6 orphan `common` keys (`about-background`, `about-background-desc`,
   `about-main-description`, `about-title-highlight-1`, `about-title-highlight-2`,
   `hero-page-scroll-notice`) **in Crowdin**, not in the JSON.
5. **Flag for human proofreading before download.** Machine output caused this; machine
   output will not fix it. Mark these unapproved and route to a native reviewer:
   - **`uk` is the priority.** `hero-site-title` is `"Привет, я Тайлер!"` — that is
     **Russian, not Ukrainian**. On a Ukrainian locale this is not a subtle defect. The
     same file has `reach-out-desc` ending in "привести ваш проект до **розчарування**"
     (*to disappointment* — the inverse of the source), `about-background-desc` reading
     "I'm a **cool** musician **over 15 years old**", and a dropped sentence.
   - **Meaning inversions in `reach-out-desc`**, all from *fruition*: `da` (*stall*),
     `sv` (*fruit tree*), `uk` (*disappointment*), `pt` (*usufruct*), `pl` (*fruiting*),
     `fi` (left in English).
   - **Gender** — `fr` `about-card-code-desc` has "collaboratrice", `it` `reach-out-desc`
     has "felicissima". Tyler is he/him. Add a project-level translator note.
   - **Title case** — `de`, `es`, `it`, `nl`, `pl`, `pt` copy English title casing onto
     languages that don't use it (`skills-title`, several card titles). Project-level note.
   - **Untranslated leftovers** — `da` `skills-title` ("Skills Learned Langs My Journey"),
     `sv` `skills-title` ("Skills Learned My Journey"), `da` `hero-site-subtitle`,
     `it` `reach-out-title` ("Raggiungere Out!"), `fi` `collegeemail-description`
     ("Uses vanilla HTML-ja…"), and "dang" surviving verbatim in `fi`, `nl`, `pl`.
   - **`fi` and `sv` `about-card-origin-desc`** both pulled EU-legislative boilerplate out
     of translation memory — *"transposed into national legislation"* / *"införlivande"*.
     Check whether a stale TM is shared across this project and report what you find.
6. **Ask for approval**, then `crowdin download`. Run `bun run i18n:verify` and
   `bun run typecheck` on the result. Any verify failure means the download is not
   mergeable — fix in Crowdin and re-download; do not patch the JSON.
7. Open a PR against `modernize-updates` with the before/after `crowdin status` table and
   the verify output. Merge needs CI green → a `code-review` of the diff → Tyler's go.

---

## Definition of done

- `bun run i18n:verify` passes on all 13 locales and runs in CI.
- Zero key drift, zero placeholder mismatches, zero malformed or empty tags.
- Do-Not-Translate list live in Crowdin; the proper-noun corruptions above are gone.
- `uk` `hero-site-title` is Ukrainian.
- No `reach-out-desc` tells the reader their project will stall, disappoint, or become a
  fruit tree.
- No non-`en` locale JSON was hand-edited at any point.

## Report back

State plainly what was fixed, what is still awaiting a human proofreader per locale, and
anything you deliberately did not touch. If a phase is blocked on an approval or a missing
env var, finish every unblocked phase first and say exactly what is outstanding.
