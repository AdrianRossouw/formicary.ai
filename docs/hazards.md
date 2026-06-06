# Hazard register — formicary.ai

| # | Hazard | Potential harm | Control | Controlling REQ |
|---|---|---|---|---|
| H-001 | Feed HTML injected into page DOM via `innerHTML` or similar | XSS: attacker-controlled content in Scout feed executes in user's browser | All feed content rendered via `textContent` only; `DOMParser` used solely for text extraction, parsed DOM never appended to document | REQ-004 |
| H-002 | `CNAME` file absent from deployed `_site/` output | Custom domain `formicary.ai` drops on deploy; site becomes unreachable at the apex domain | `CNAME` kept in repository root; Jekyll copies it to `_site/` on every build; verified in CI | REQ-006 |
| H-003 | SHA-pinned gist URL used for Scout feed | Page freezes to one feed revision; new Scout entries never appear; only recoverable by a source change and redeploy | Feed URL in `scout.js` source SHALL NOT include a commit SHA path segment; unpinned URL used at all times | REQ-003 |
| H-004 | Scout feed unavailable or CORS failure at runtime | Scout page shows no content with no explanation; user cannot distinguish "no items" from "something broke" | Explicit error state displayed on fetch failure or parse error; message is clear and non-alarming | REQ-007 |
| H-005 | Em-dash character (U+2014) appears in site-authored copy | Undermines the author's stated writing constraints; signals AI-generated copy to the intended audience | Em-dash prohibition documented as REQ-005; checked manually at each page build step | REQ-005 |
