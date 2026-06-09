// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { UserConfig } from "vite";

// ============================================================================
// Configuration
// ============================================================================

export default defineConfig({
  // TanStack Start specific configuration
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },

  // Optional: Add additional Vite configuration here
  // vite: {
  //   optimizeDeps: {
  //     include: ['some-package'],
  //   },
  //   server: {
  //     port: 5173,
  //   },
  // },

  // Optional: Add additional Nitro configuration here
  // nitro: {
  //   preset: "cloudflare",
  //   storage: {
  //     // Custom storage configuration
  //   },
  // },
});

// ============================================================================
// Additional Configuration Helpers (if needed)
// ============================================================================

/**
 * Environment-specific configuration
 *
 * @example
 * const config = defineConfig({
 *   tanstackStart: {
 *     server: { entry: "server" },
 *     ...(process.env.NODE_ENV === "development" && {
 *       devtools: true,
 *     }),
 *   },
 * });
 */

/**
 * Custom server entry point
 * The server.ts file handles:
 * - Error capture and recovery
 * - Request logging
 * - Health checks
 * - Catastrophic SSR error handling
 *
 * @see src/server.ts for implementation
 */

// ============================================================================
// Notes
// ============================================================================

/*
 * DO NOT manually add these plugins:
 * - tanstackStart
 * - viteReact
 * - tailwindcss
 * - tsConfigPaths
 * - componentTagger (dev-only)
 *
 * These are already provided by @lovable.dev/vite-tanstack-config
 * Adding them manually will cause duplicate plugin errors.
 *
 * Allowed customizations:
 * - Additional Vite plugins (must not conflict)
 * - Custom build options
 * - Environment variable overrides (VITE_*)
 * - Server port/host configuration
 *
 * For production:
 * - The app builds to Cloudflare Workers by default
 * - Server entry is src/server.ts
 * - Static assets are served from the dist directory
 */
