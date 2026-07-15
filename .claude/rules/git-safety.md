# Git safety

- **Never** commit, push, or merge to the protected default branch (`main`) without
  Tyler's explicit approval. `main` is production.
- **Never** force-push or rewrite history without explicit approval.
- Merges into the integration branch (`modernize-updates`) require: CI green → a
  `code-review` of the diff → Tyler's go.
- Commit or push only when asked. If work starts on `main`, branch first.
