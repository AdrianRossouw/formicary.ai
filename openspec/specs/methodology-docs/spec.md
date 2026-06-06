# methodology-docs Specification

## Purpose
TBD - created by archiving change formicary-ai-site. Update Purpose after archive.
## Requirements
### Requirement: REQ-026 Requirements document with EARS-style REQ-IDs

`docs/requirements.md` SHALL exist and contain all site requirements as numbered REQ-NNN entries. Each requirement SHALL have a unique sequential REQ-NNN identifier. Requirements SHALL use EARS syntax (SHALL/MUST) where the form is applicable. The initial set SHALL include at minimum REQ-001 through REQ-036 as defined across all capability specs in this change. The document SHALL be the authoritative list; any requirement added later SHALL receive a new sequential REQ-ID.

#### Scenario: All REQ-IDs present

- **WHEN** `docs/requirements.md` is read
- **THEN** it contains an entry for every REQ-ID defined across the capability specs, each with a distinct identifier and EARS-style statement

### Requirement: REQ-027 Traceability table

`docs/traceability.md` SHALL contain a table mapping every REQ-ID in `docs/requirements.md` to: the implementing file(s) and the verification method. The traceability table SHALL be updated whenever a requirement is implemented or a new requirement is added. REQ-004 SHALL list `tests/scout.test.js` as its verification method.

#### Scenario: Every REQ-ID traced

- **WHEN** `docs/traceability.md` is read
- **THEN** every REQ-ID present in `docs/requirements.md` has a corresponding row with a non-empty implementing file and verification method

### Requirement: REQ-028 Hazard register

`docs/hazards.md` SHALL contain a hazard register with at minimum the four seeded hazards: feed HTML injection (control: REQ-004 textContent-only rendering), CNAME drop on deploy (control: REQ-006 CNAME in source), SHA-pinned feed URL freezing the page (control: REQ-003 unpinned URL), and feed unavailability/CORS failure (control: REQ-007 explicit error state). Each entry SHALL include the hazard description, the control measure, and the REQ-ID of the controlling requirement.

#### Scenario: Seeded hazards present with REQ-ID controls

- **WHEN** `docs/hazards.md` is read
- **THEN** all four seeded hazards are present, each with a stated control and a REQ-ID reference

### Requirement: REQ-029 SOUP register

`docs/soup.md` SHALL contain a SOUP (Software of Unknown Provenance) register listing all external and third-party components used by the site and its build. Minimum entries: Jekyll (version from Gemfile), `jekyll-seo-tag`, `actions/checkout`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, and the Scout Atom feed (as an external data source). Each entry SHALL include the component name, version or pinned reference, and purpose.

#### Scenario: Minimum SOUP entries present

- **WHEN** `docs/soup.md` is read
- **THEN** it contains entries for Jekyll, `jekyll-seo-tag`, the four Actions dependencies, and the Scout feed

### Requirement: REQ-030 REQ-ID commit convention

Every commit that implements or modifies a site requirement SHALL reference the relevant REQ-ID(s) in the commit message subject or body. The convention SHALL follow the pattern `feat(REQ-NNN): description` or include `REQ-NNN` in the message body for multiple IDs. This convention SHALL be documented in `docs/requirements.md` with an example.

#### Scenario: Convention documented with example

- **WHEN** `docs/requirements.md` is read
- **THEN** the REQ-ID commit message convention is stated with a concrete example commit message

