# Pavel Lazarev — engineering workshop

Personal website: https://pawellazarew.github.io/

Static HTML, CSS and JavaScript. No build step or external runtime dependencies. English and Russian, an interactive development loop, selected open-source projects and contact links. Core content works without JavaScript.

## Preview and checks

Open `index.html` in a browser, or run `python3 -m http.server 8080`.

```sh
node --check script.js
python3 scripts/check_site.py
npm install --no-save --package-lock=false playwright-core@1.62.0
npx playwright-core install chromium
node scripts/smoke.cjs
```

The browser check covers both languages, language persistence, workflow interactions, page errors and horizontal overflow at 375, 768 and 1440 px. Project illustrations are stylized diagrams, not screenshots of actual runs.

## Deployment

GitHub Actions checks pull requests and deploys `main` to GitHub Pages. Pages source must be set to **GitHub Actions**. Only the five public site files are uploaded; scripts and documentation are excluded.

Changes go through a branch and PR; merge after checks and visual acceptance. If a deployment breaks the page or language switching, revert the merged PR through a new PR and redeploy the previous working version.
