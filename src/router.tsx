import { QueryClient, QueryClientConfig } from "@tanstack/react-query";
import { createRouter, RouterConfig } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// ============================================================================
// Configuration Constants
// ============================================================================

const DEFAULT_QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

const DEFAULT_ROUTER_CONFIG: Partial<RouterConfig> = {
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => null,
  defaultErrorComponent: undefined,
  defaultNotFoundComponent: undefined,
};

// ============================================================================
// Query Client Factory
// ============================================================================

let globalQueryClient: QueryClient | null = null;

/**
 * Creates or returns a cached QueryClient instance.
 * Use this for server-side rendering to avoid creating multiple instances.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server-side: create new instance
    return new QueryClient(DEFAULT_QUERY_CONFIG);
  }

  // Client-side: reuse singleton
  if (!globalQueryClient) {
    globalQueryClient = new QueryClient(DEFAULT_QUERY_CONFIG);
  }
  return globalQueryClient;
}

/**
 * Resets the global QueryClient instance.
 * Useful for testing or clearing cached data.
 */
export function resetQueryClient(): void {
  if (typeof window !== "undefined" && globalQueryClient) {
    globalQueryClient.clear();
    globalQueryClient = null;
  }
}

// ============================================================================
// Router Factory
// ============================================================================

export interface RouterContext {
  queryClient: QueryClient;
}

/**
 * Creates a new router instance with the given options.
 *
 * @param options - Optional router configuration overrides
 * @returns TanStack Router instance
 */
export function createAppRouter(options?: Partial<RouterConfig<RouterContext>>) {
  const queryClient = getQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    ...DEFAULT_ROUTER_CONFIG,
    ...options,
  });

  // Log route changes in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    router.subscribe("onResolved", () => {
      console.debug("[Router] Location:", router.state.location.pathname);
    });
  }

  return router;
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Prefetch a route's data before navigating.
 * Useful for optimistic loading.
 */
export async function prefetchRoute(
  router: ReturnType<typeof createAppRouter>,
  to: string,
  params?: Record<string, string>,
) {
  try {
    await router.prefetchRoute({
      to,
      params,
    });
    return true;
  } catch (error) {
    console.error(`[Router] Failed to prefetch route: ${to}`, error);
    return false;
  }
}

/**
 * Navigate to a route with error handling.
 */
export async function safeNavigate(
  router: ReturnType<typeof createAppRouter>,
  to: string,
  params?: Record<string, string>,
  search?: Record<string, unknown>,
) {
  try {
    await router.navigate({
      to,
      params,
      search,
    });
    return true;
  } catch (error) {
    console.error(`[Router] Failed to navigate to: ${to}`, error);
    return false;
  }
}

/**
 * Get the current route path.
 */
export function getCurrentPath(router: ReturnType<typeof createAppRouter>): string {
  return router.state.location.pathname;
}

/**
 * Check if a route is currently active.
 */
export function isRouteActive(router: ReturnType<typeof createAppRouter>, routePath: string): boolean {
  const currentPath = getCurrentPath(router);
  return currentPath === routePath || currentPath.startsWith(`${routePath}/`);
}

// ============================================================================
// Route Guards
// ============================================================================

export type RouteGuard = (router: ReturnType<typeof createAppRouter>, to: string) => boolean | Promise<boolean>;

const routeGuards: Map<string, RouteGuard> = new Map();

/**
 * Registers a route guard for a specific route.
 */
export function addRouteGuard(routePath: string, guard: RouteGuard): void {
  routeGuards.set(routePath, guard);
}

/**
 * Removes a route guard.
 */
export function removeRouteGuard(routePath: string): void {
  routeGuards.delete(routePath);
}

/**
 * Checks if navigation should be allowed to a route.
 */
export async function canNavigateTo(router: ReturnType<typeof createAppRouter>, to: string): Promise<boolean> {
  for (const [routePath, guard] of routeGuards.entries()) {
    if (to.startsWith(routePath)) {
      const allowed = await guard(router, to);
      if (!allowed) return false;
    }
  }
  return true;
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Gets the router instance (backward compatible with original API).
 */
export const getRouter = createAppRouter;

// ============================================================================
// Default Export
// ============================================================================

export default {
  getRouter: createAppRouter,
  getQueryClient,
  resetQueryClient,
  createRouter: createAppRouter,
  prefetchRoute,
  safeNavigate,
  getCurrentPath,
  isRouteActive,
  addRouteGuard,
  removeRouteGuard,
  canNavigateTo,
};
