# formicary.ai — agent guidance

## Project

Jekyll 4.x static site at `https://formicary.ai`. Dogfoods regulated-software
discipline on AI-generated code. Primary artefacts: `index.md` (thesis),
`scout.html` + `assets/js/scout.js` (live feed reader), `about.md`. Tests at
`tests/scout.test.js` via Vitest (`npm test`). Build: `bundle exec jekyll build`.

Design tokens live in `assets/css/tokens.css` (verbatim copy — never edit).
Class names must match the brief in `docs/_brief/design_brief/` exactly; read
those HTML files before implementing any page or component.

Requirements are in `docs/requirements.md` (REQ-001 through REQ-036).
Traceability is in `docs/traceability.md`.

## Commit convention

Every commit that **implements or modifies** a requirement must reference the
relevant REQ-IDs in the subject scope. This applies to **all** commit types —
`feat`, `fix`, `refactor`, `test`, `docs` — not only `feat`.

```
feat(REQ-003,REQ-004): add Scout feed with safe text rendering
fix(REQ-007,REQ-014,REQ-022): align Scout page to design brief
refactor(REQ-003,REQ-020,REQ-031): simplify parseFeed and test helpers
test(REQ-031,REQ-032,REQ-033): extend parseFeed coverage
```

**chore:** commits that touch only task-tracking files (tasks.md, CLAUDE.md,
.gitignore) do not need REQ-IDs.

**Finding the right REQ-IDs:** scan the diff — every file you touch maps to one
or more requirements. Cross-reference `docs/requirements.md` for the IDs. Err
on the side of including more rather than fewer; missing an ID is a traceability
gap, an extra one is not.

**Subjects describe the change, not the tool.** Never write "per /simplify
findings" or "via /code-review" in a subject line — those are session artefacts,
not meaningful history.

## Branch discipline

Every change goes on a named branch. Merge to `main` with `--no-ff`.

```
git checkout -b fix/scout-card-layout
# ... make changes ...
git checkout main
git merge --no-ff fix/scout-card-layout
```

Branch prefix matches the commit type: `feat/`, `fix/`, `refactor/`, `docs/`,
`test/`, `chore/`.

Direct commits to `main` are only permitted for the repository's very first
commit and for single-line chore entries that touch only task-tracking files.
Maintenance work (refactors, simplification passes, test additions) still gets
a branch and a merge commit — the branch name is what links the work to a unit
of intent in the log.

## Pre-commit checklist

Before every `git commit` that touches implementation files:

1. Am I on a named branch (not `main`)?
2. Does the subject follow `type(REQ-NNN,...): imperative description`?
3. Does the REQ-ID list cover every requirement whose implementing files appear
   in `git diff --stat`? (grep `docs/requirements.md` if unsure)
4. Is the subject under ~72 characters?
5. Does the subject describe the *what*, not the tool or session that prompted it?
