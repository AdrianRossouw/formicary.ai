## ADDED Requirements

### Requirement: REQ-023 About page renders provided copy

`about.md` SHALL use the default layout with `layout_shell: shell`. The page content SHALL be sourced from `docs/_brief/build_spec/formicary-about.md`. The AI-use disclosure block at the top of that source SHALL be rendered using the epistemic callout component (`_includes/epistemic.html`) with label "AI-use disclosure".

#### Scenario: Disclosure callout present

- **WHEN** the about page is built
- **THEN** `aside.epistemic` with label "AI-use disclosure" appears before the main prose

### Requirement: REQ-024 Two-column is/isn't block

The about page SHALL render a two-column "What it is / What it isn't" block using `.col2` and `.isnt-list` CSS classes. At viewport widths below 720px the block SHALL collapse to a single column. "What it is" items SHALL use the `+` mark in `--accent`; "What it isn't" items SHALL use the `-` mark in `--ink-faint`.

#### Scenario: Two columns at wide viewport

- **WHEN** the about page is viewed at a viewport width of 720px or wider
- **THEN** the is/isn't block renders in two columns

#### Scenario: Single column at narrow viewport

- **WHEN** the about page is viewed at a viewport width below 720px
- **THEN** the is/isn't block renders in a single column

### Requirement: REQ-025 Contact section

The about page SHALL include a contact section rendered as `dl.bio-grid` with rows for Email, Writing, Feed, and Licence. The email address SHALL be `formicary@localghost.ie`. No em-dashes in any contact copy.

#### Scenario: Contact details present

- **WHEN** the about page is built
- **THEN** `dl.bio-grid` contains rows for Email, Writing, Feed, and Licence with the correct values
