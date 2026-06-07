## Decision: weekly entries are filtered, not rendered

Weekly roundup entries (those whose Atom `<id>` contains `/scout/weekly/`) are dropped inside `parseFeed` before the item array is returned to the renderer. No card variant is rendered for weekly entries.

This spec exists to record the decision. If a future change introduces weekly card rendering, this file should be replaced with the corresponding ADDED requirement.

## Rationale

See `design.md`. The filter approach is the smallest correct fix. The weekly digest is already readable at its canonical URL. A new card type would require new parsing logic, new rendering, and new tests across all three layers — disproportionate for the current phase.
