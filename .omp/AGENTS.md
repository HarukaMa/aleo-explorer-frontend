# Aleoscan frontend

## Stack

- SvelteKit with Svelte 5 and TypeScript
- ESM modules
- pnpm package manager

## Upstream backend

- Frontend API behavior is implemented by the separate [`aleo-explorer`](https://github.com/HarukaMa/aleo-explorer)
  backend repository under `src/webapi`.
- Locate the backend checkout from the current developer environment. Do not assume a machine-specific path.

## Commands

- Install: `pnpm install`
- Develop: `pnpm run dev`
- Build: `pnpm run build`
- Preview: `pnpm run preview`
- Type check: `pnpm run check`
- Lint: `pnpm run lint`
- Format: `pnpm run format`

## Code conventions

- Treat Prettier as the formatting source of truth.
- Use 2 spaces, double quotes, no semicolons, trailing commas, and a 120-character print width.
- Keep Svelte components ordered as scripts, styles, markup, then options.
- Keep TypeScript strict and use ESM imports.
- Use `$lib` imports for project modules.
- Follow SvelteKit routing conventions for pages and layouts.
- Format touched files with `pnpm exec prettier --write <files>`.

## Verification

- Run the smallest command that covers the changed behavior.
- For UI changes, run the development server and verify the affected route in a browser.
- Report project-wide check failures exactly when existing diagnostics prevent a clean result.

## Figma design reference

- Use `.omp/cache/figma/file.json` when it exists.
- Create the initial snapshot only with an explicit Figma file URL or file ID.
- Refresh an existing snapshot only after confirmation that the source changed.
- Replace the snapshot in place. Do not poll Figma or keep historical snapshots.
