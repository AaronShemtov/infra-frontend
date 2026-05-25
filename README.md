# infra-frontend

Infrastructure walkthrough — deployed at [infra.1ms.my](https://infra.1ms.my).

Static one-page architecture deep-dive of the Kubernetes platform behind `1ms.my`, `cv.1ms.my` and this site. Same look-and-feel as `cv-frontend` (collapsible sections, dark/light theme), different content.

## Editing content

All content lives in `public/index.html`. Each section is a `<article class="experience expanded">` block — copy one to add a new section.

After editing, push to `main`. GitHub Actions builds an arm64 image, pushes to OCIR. Flux Image Automation detects the new tag and rolls out the deployment in ~3 minutes.

## Stack

- Static HTML/CSS/JS — no build step, no framework
- nginx-unprivileged (Alpine) container, ~20 MB
- GitHub Actions CI → OCIR
- Flux Image Automation closes the GitOps loop

## Local preview

```bash
cd public
python3 -m http.server 8000
# open http://localhost:8000
```

## License

MIT — see `LICENSE`.
