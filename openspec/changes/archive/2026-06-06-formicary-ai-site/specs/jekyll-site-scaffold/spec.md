## ADDED Requirements

### Requirement: REQ-011 Jekyll project structure

The repository SHALL contain a valid Jekyll project structure deployable to GitHub Pages via a custom Actions workflow. The Gemfile SHALL pin Jekyll and list only whitelisted gems. `_config.yml` SHALL set `url: "https://formicary.ai"`, `baseurl: ""`, and exclude `docs/`, `Gemfile`, `Gemfile.lock`, and `openspec/` from the build output.

#### Scenario: Local build succeeds

- **WHEN** `bundle exec jekyll build` is run in the project root
- **THEN** a `_site/` directory is produced containing `index.html`, `scout/index.html`, `about/index.html`, and `CNAME`

### Requirement: REQ-006 CNAME in deployed output

The file `CNAME` containing exactly `formicary.ai` SHALL be present in the repository root so Jekyll copies it to `_site/` on every build. The GitHub Actions workflow SHALL NOT delete or override this file.

#### Scenario: CNAME survives build

- **WHEN** `bundle exec jekyll build` completes
- **THEN** `_site/CNAME` exists and contains `formicary.ai`

#### Scenario: CNAME survives deploy

- **WHEN** the GitHub Actions deploy workflow completes successfully
- **THEN** the live site at `https://formicary.ai` responds to requests (custom domain not dropped)

### Requirement: REQ-010 GitHub Actions deploy workflow

The repository SHALL contain a GitHub Actions workflow at `.github/workflows/deploy.yml` that triggers on push to `main` and on manual dispatch. The workflow SHALL use `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. It SHALL build with `bundle exec jekyll build` and deploy the `_site/` output to GitHub Pages.

#### Scenario: Push to main triggers deploy

- **WHEN** a commit is pushed to the `main` branch
- **THEN** the Actions workflow runs, builds the site, and deploys to GitHub Pages without manual intervention

### Requirement: REQ-001 HTTPS on apex domain

The site SHALL be served over HTTPS at `https://formicary.ai`. DNS is pre-configured (apex A records to GitHub Pages IP addresses; `www` CNAME to `adrianrossouw.github.io`). The GitHub Pages custom domain setting SHALL have "Enforce HTTPS" enabled once the certificate has provisioned.

#### Scenario: HTTP redirects to HTTPS

- **WHEN** a browser navigates to `http://formicary.ai`
- **THEN** the response is an HTTPS redirect and the final page loads over HTTPS
