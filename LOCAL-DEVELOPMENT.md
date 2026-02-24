# Local Payload Development

This monorepo includes the Payload CMS source and the **farmersstuff** app template. You can build Payload locally and use the **local CLI** (e.g. `payload generate:types`) without publishing packages.

## One-time setup

1. **Install dependencies** (from this `payload/` directory):

   ```bash
   pnpm install
   ```

   This links `templates/farmersstuff` and all `@payloadcms/*` / `payload` packages via the workspace.

2. **Build Payload** (required for the CLI; the `payload` bin uses `dist/`):
   ```bash
   pnpm build
   ```
   This runs `build:core`: it builds the core Payload packages (payload, next, ui, db-\*, etc.) but does **not** build the farmersstuff Next.js app.

## Using the local CLI

**Option A – from monorepo root (`payload/`):**

```bash
pnpm farmersstuff:generate:types
pnpm farmersstuff:generate:importmap
# or pass any payload CLI command:
pnpm farmersstuff:payload -- generate:types
pnpm farmersstuff:payload -- generate:importmap
```

**Option B – from the farmersstuff app directory:**

```bash
cd templates/farmersstuff
pnpm payload generate:types
pnpm payload generate:importmap
# or any other payload CLI command
```

Note: If you are already in `payload/`, use `cd templates/farmersstuff` (not `cd payload/templates/farmersstuff`).

The `payload` binary comes from the workspace-linked `packages/payload` package. As long as you have run `pnpm build` once from the monorepo root, the CLI will use the built local code.

## Rebuilding after Payload changes

After changing code in `packages/payload` or other core packages, rebuild so the CLI and runtime use your changes:

```bash
# From payload/ (monorepo root)
pnpm build
```

For a clean rebuild:

```bash
pnpm build:force
```

## Running the farmersstuff app

From monorepo root: `pnpm farmersstuff:dev`

Or from the app directory:

```bash
cd templates/farmersstuff
pnpm dev
```

For a production-style run:

```bash
pnpm build   # build Next.js app
pnpm start
```

## Summary

| Goal                 | Command / location                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Build Payload (core) | From `payload/`: `pnpm build`                                                               |
| Use Payload CLI      | From `payload/`: `pnpm farmersstuff:payload -- <cmd>` or `pnpm farmersstuff:generate:types` |
| Run farmersstuff dev | From `payload/`: `pnpm farmersstuff:dev`                                                    |
