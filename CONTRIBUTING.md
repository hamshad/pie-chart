# Contributing to @hamshad/pie-chart

First off, thanks for taking the time to contribute! ❤️

This document describes how to propose changes, report issues, ask questions, and help improve the project.

## Table of Contents
- Code of Conduct
- Ways to Contribute
- Getting Started (Dev Setup)
- Branching & Workflow
- Commit Message Guidelines
- Pull Request Guidelines
- Coding Standards
- Releasing (Maintainers)
- FAQ

## Code of Conduct
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Ways to Contribute
- Report bugs (use the Bug Report issue template)
- Request features or enhancements
- Improve documentation or examples
- Fix typos, grammar, or clarify wording
- Refactor code or improve performance
- Add tests (when test harness exists)

## Getting Started (Dev Setup)
1. Fork the repo and clone your fork
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server & open the example:
   ```bash
   npm run dev
   # Open http://localhost:5173/example/index.html
   ```
4. Make changes in `src/` — the example reads from the source directly.

Build the library bundle:
```bash
npm run build:lib
```

## Branching & Workflow
- `main` contains the latest released (or soon-to-be released) code
- Create feature branches from `main`:
  - `feat/<short-description>` for new features
  - `fix/<short-description>` for bug fixes
  - `chore/<short-description>` for maintenance
  - `docs/<short-description>` for docs-only changes

Example:
```
git checkout -b feat/hover-offset-animation
```

## Commit Message Guidelines
Use (light) [Conventional Commits](https://www.conventionalcommits.org/) — this helps with readability and potential automated changelog generation later.

Format:
```
<type>(optional-scope): <short summary>
```
Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `build`.

Examples:
- `feat: add gap prop for segment spacing`
- `fix: correct label positioning when innerRadiusRatio changes`
- `docs: clarify installation instructions`

## Pull Request Guidelines
Before opening a PR:
- Ensure it is scoped to a single logical change
- Run a build (`npm run build:lib`) to confirm no type errors
- Ensure no unrelated formatting changes
- Update docs/README if user-facing behavior changes
- Add or update example usage if helpful
- Link to any related issue (e.g. closes #NN)

PR Checklist (also in the template):
- [ ] Title follows Conventional Commits
- [ ] Linked issue (if applicable)
- [ ] Code builds without errors
- [ ] Docs updated (if needed)
- [ ] Example updated (if needed)

## Coding Standards
- Language: TypeScript + React
- Prefer functional components
- Keep the public API small & focused
- Avoid adding runtime dependencies (keep library lightweight)
- Use descriptive prop names; prefer explicit over clever
- Keep animation logic readable & commented when non-obvious

### Types & Interfaces
- Export only necessary types from `index.ts`
- Keep prop interfaces stable; add new optional props instead of breaking changes when possible

### Performance
- Avoid unnecessary re-renders (memoize derived values if needed)
- Keep DOM node count minimal

## Testing (Future Placeholder)
Currently no automated test suite. You can manually validate using the example app. If you want to introduce a lightweight test harness (e.g. Vitest + React Testing Library), open an issue to discuss first.

## Releasing (Maintainers Only)
1. Update version in `package.json` following semver
2. Run `npm run build`
3. Verify `dist/` contents
4. Commit & tag (e.g., `git tag v1.0.4 && git push --tags`)
5. `npm publish --access public`
6. Draft release notes (optional)

## FAQ
**Q: Can I add a dependency?**  
A: Prefer not. Open an issue and justify the trade-off.

**Q: How do I add new props?**  
A: Make them optional and document them in README props table.

**Q: Something unclear?**  
A: Open a discussion or issue — happy to improve docs.

---
Thanks again for contributing 🙌
