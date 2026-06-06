## ADDED Requirements

### Requirement: REQ-018 Thesis page renders essay content

`index.md` SHALL use the default layout with `layout_shell: shell`. The page content SHALL be sourced from `docs/_brief/build_spec/formicary-thesis-web.md`. The leading blockquote in that source SHALL be replaced with the epistemic-status callout component (`_includes/epistemic.html`); no default blockquote styling SHALL be applied to it.

#### Scenario: Essay content present

- **WHEN** the landing page is built
- **THEN** the essay text from `formicary-thesis-web.md` appears in the rendered output (minus the leading blockquote)

### Requirement: REQ-002 Epistemic-status callout on landing

The landing page SHALL render an epistemic-status callout as the first element of the essay body, above all prose. The callout SHALL display Status, Confidence, and Last revised fields. No em-dashes in the callout copy.

#### Scenario: Callout is first essay element

- **WHEN** the landing page is built
- **THEN** `aside.epistemic` appears before the first prose paragraph in the essay article

#### Scenario: Callout fields populated

- **WHEN** the landing page is built
- **THEN** the callout `<dl>` contains rows for Status, Confidence, and Last revised

### Requirement: REQ-019 Masthead with title and deck as a pair

The landing page masthead SHALL render: an eyebrow kicker, the title "What survives the agent", the deck/subtitle immediately below with an accent keyline, and a byline. The title and deck SHALL be visually presented as a pair — the deck SHALL have real visual presence directly under the title.

#### Scenario: Title and deck present

- **WHEN** the landing page is built
- **THEN** `.masthead__title` contains "What survives the agent" and `.masthead__deck` is immediately adjacent in the DOM

### Requirement: REQ-005 No em-dashes in site-authored copy

The thesis page HTML output SHALL contain no em-dash characters (U+2014) in any site-authored copy. The masthead, callout, byline, and navigation SHALL contain no em-dashes. Em-dashes present in the essay body text of `formicary-thesis-web.md` are the author's content and are exempt.

#### Scenario: No em-dash in masthead or callout

- **WHEN** the landing page is built
- **THEN** `.masthead`, `aside.epistemic`, `.site-head`, and `.site-foot` contain no U+2014 characters
