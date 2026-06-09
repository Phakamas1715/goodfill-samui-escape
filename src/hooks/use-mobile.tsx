import * as React from "react";

// ============================================================================
// Constants
// ============================================================================

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;

export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

// ============================================================================
// Helper Functions
// ============================================================================

function getBreakpoint(width: number): Breakpoint {
  if (width < MOBILE_BREAKPOINT) return "mobile";
  if (width < TABLET_BREAKPOINT) return "tablet";
  if (width < DESKTOP_BREAKPOINT) return "desktop";
  return "wide";
}

function isMobileWidth(width: number): boolean {
  return width < MOBILE_BREAKPOINT;
}

function isTabletWidth(width: number): boolean {
  return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
}

function isDesktopWidth(width: number): boolean {
  return width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT;
}

function isWideWidth(width: number): boolean {
  return width >= DESKTOP_BREAKPOINT;
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Hook to detect if the current viewport is mobile size.
 * Returns true for screens less than 768px.
 *
 * @example
 * const isMobile = useIsMobile();
 * return <div>{isMobile ? 'Mobile view' : 'Desktop view'}</div>
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // SSR safe initial state
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    // Skip if window is not defined (SSR)
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      // Debounce resize events for better performance
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, 100);
    };

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}

// ============================================================================
// Extended Hooks
// ============================================================================

/**
 * Hook that returns detailed breakpoint information.
 *
 * @example
 * const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 * if (isMobile) return <MobileLayout />
 * if (isTablet) return <TabletLayout />
 * return <DesktopLayout />
 */
export function useBreakpoint(): {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
} {
  const [state, setState] = React.useState(() => {
    if (typeof window === "undefined") {
      return {
        breakpoint: "desktop" as Breakpoint,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isWide: false,
        width: 1024,
      };
    }
    const width = window.innerWidth;
    return {
      breakpoint: getBreakpoint(width),
      isMobile: isMobileWidth(width),
      isTablet: isTabletWidth(width),
      isDesktop: isDesktopWidth(width),
      isWide: isWideWidth(width),
      width,
    };
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setState({
          breakpoint: getBreakpoint(width),
          isMobile: isMobileWidth(width),
          isTablet: isTabletWidth(width),
          isDesktop: isDesktopWidth(width),
          isWide: isWideWidth(width),
          width,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

// ============================================================================
// Orientation Hook
// ============================================================================

/**
 * Hook to detect device orientation (portrait/landscape).
 *
 * @example
 * const { orientation, isPortrait, isLandscape } = useOrientation();
 */
export function useOrientation(): {
  orientation: "portrait" | "landscape";
  isPortrait: boolean;
  isLandscape: boolean;
} {
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">(() => {
    if (typeof window === "undefined") return "landscape";
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? "portrait" : "landscape");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    orientation,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
}

// ============================================================================
// Media Query Hook
// ============================================================================

/**
 * Hook that matches a CSS media query.
 *
 * @example
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

// ============================================================================
// Dimension Hook
// ============================================================================

/**
 * Hook that returns the current window dimensions.
 * Useful for responsive calculations.
 *
 * @example
 * const { width, height } = useWindowSize();
 * const isSmall = width < 640;
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = React.useState(() => {
    if (typeof window === "undefined") {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return size;
}

// ============================================================================
// SSR Safe Hook
// ============================================================================

/**
 * Hook that returns true only after component mounts (client-side).
 * Useful for preventing hydration mismatches with responsive components.
 *
 * @example
 * const isMounted = useMounted();
 * if (!isMounted) return null; // or return skeleton
 * return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  useIsMobile,
  useBreakpoint,
  useOrientation,
  useMediaQuery,
  useWindowSize,
  useMounted,
};
