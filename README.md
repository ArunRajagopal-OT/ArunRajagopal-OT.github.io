# Arun Rajagopal — OT Cybersecurity Portfolio

Welcome to my professional portfolio.

I am an OT and industrial cybersecurity professional with experience spanning industrial automation, control systems, cybersecurity strategy, security architecture, cyber risk, assurance, critical infrastructure and IEC 62443.

This portfolio brings together my professional background, areas of expertise, certifications, industry experience and selected client engagements across OT, ICS and critical infrastructure environments.

🌐 **View my portfolio:** https://arunrajagopal-ot.github.io/

This repository hosts the GitHub Pages site for my portfolio and will continue to evolve alongside my professional work, technical interests and contributions to the industrial cybersecurity community.

## Section pages

Each main section also has its own URL that shows only that section (plus the sidebar, nav and the Connect panel), for example `/speaking/`, `/publications/` and `/sectors/`.

How it works: `index.html` and every section page load the same shared script, `assets/js/site-loader.js`, which builds the page from the `exact/*.part` files. A section page passes `data-section="<section id>"`, and the loader hides everything else and adds a "View full portfolio" link.

To add a new section page:

1. Copy an existing folder, for example `speaking/index.html`, to `<slug>/index.html`.
2. In the copy, change the `<title>`, the meta description, the canonical URL and `data-section` (the `id` of the `<section>` in the parts).
3. Add the section id and its URL to `PAGES` in `assets/js/site-loader.js`, so the nav on other section pages links to it.
4. Add the URL to `sitemap.xml`.

Short alias folders (`sector/`, `publication/`, `credential/`, `certifications/`, `client/`, `impact/`, `connect/`) only redirect to the main section page.
