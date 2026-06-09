// ============================================================================
// Types & Configuration
// ============================================================================

interface ErrorPageOptions {
  title?: string;
  message?: string;
  showDetails?: boolean;
  error?: Error | unknown;
  lang?: "th" | "en";
  showRefresh?: boolean;
  showHome?: boolean;
  customActions?: Array<{ label: string; onClick: string; primary?: boolean }>;
  theme?: "light" | "dark" | "brand";
}

interface ErrorPageConfig {
  title: Record<"th" | "en", string>;
  message: Record<"th" | "en", string>;
  refreshLabel: Record<"th" | "en", string>;
  homeLabel: Record<"th" | "en", string>;
  detailsLabel: Record<"th" | "en", string>;
}

// ============================================================================
// Default Content
// ============================================================================

const DEFAULT_CONFIG: ErrorPageConfig = {
  title: {
    th: "หน้านี้ไม่สามารถโหลดได้",
    en: "This page didn't load",
  },
  message: {
    th: "เกิดข้อผิดพลาดบางอย่างในระบบของเรา คุณสามารถลองรีเฟรชหรือกลับไปหน้าหลัก",
    en: "Something went wrong on our end. You can try refreshing or head back home.",
  },
  refreshLabel: {
    th: "ลองอีกครั้ง",
    en: "Try again",
  },
  homeLabel: {
    th: "กลับหน้าแรก",
    en: "Go home",
  },
  detailsLabel: {
    th: "รายละเอียดข้อผิดพลาด",
    en: "Error details",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  return "";
}

function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

function getThemeColors(theme: ErrorPageOptions["theme"] = "light"): {
  background: string;
  text: string;
  textSecondary: string;
  primaryBg: string;
  primaryHover: string;
  secondaryBg: string;
  secondaryBorder: string;
  errorBg: string;
  errorBorder: string;
} {
  if (theme === "brand") {
    return {
      background: "#FFF8EC",
      text: "#0F3D2E",
      textSecondary: "#4B5563",
      primaryBg: "#0F3D2E",
      primaryHover: "#1A5C4A",
      secondaryBg: "#FFFFFF",
      secondaryBorder: "#D1D5DB",
      errorBg: "#FEF2F2",
      errorBorder: "#FEE2E2",
    };
  }

  if (theme === "dark") {
    return {
      background: "#1A1A2E",
      text: "#EEEEEE",
      textSecondary: "#AAAAAA",
      primaryBg: "#E94560",
      primaryHover: "#FF6B6B",
      secondaryBg: "#2D2D44",
      secondaryBorder: "#444466",
      errorBg: "#2D1A1A",
      errorBorder: "#553333",
    };
  }

  // Light theme (default)
  return {
    background: "#FAFAFA",
    text: "#111111",
    textSecondary: "#4B5563",
    primaryBg: "#111111",
    primaryHover: "#333333",
    secondaryBg: "#FFFFFF",
    secondaryBorder: "#D1D5DB",
    errorBg: "#FEF2F2",
    errorBorder: "#FEE2E2",
  };
}

// ============================================================================
// Main Render Function
// ============================================================================

export function renderErrorPage(options: ErrorPageOptions = {}): string {
  const {
    lang = "th",
    showDetails = false,
    error,
    showRefresh = true,
    showHome = true,
    customActions = [],
    theme = "light",
  } = options;

  const config = DEFAULT_CONFIG;
  const colors = getThemeColors(theme);
  const errorMessage = error ? getErrorMessage(error) : "";
  const errorStack = error ? getErrorStack(error) : "";

  // Custom title/message or use defaults
  const title = options.title || config.title[lang];
  const message = options.message || config.message[lang];

  // Build actions HTML
  const actions: string[] = [];

  if (showRefresh) {
    actions.push(`
      <button class="primary" onclick="location.reload()">
        ${config.refreshLabel[lang]}
      </button>
    `);
  }

  if (showHome) {
    actions.push(`
      <a class="secondary" href="/">
        ${config.homeLabel[lang]}
      </a>
    `);
  }

  for (const action of customActions) {
    actions.push(`
      <button 
        class="${action.primary ? "primary" : "secondary"}" 
        onclick="${action.onClick}"
      >
        ${action.label}
      </button>
    `);
  }

  // Build error details HTML if enabled
  const errorDetailsHtml =
    showDetails && (errorMessage || errorStack)
      ? `
    <details class="error-details">
      <summary>${config.detailsLabel[lang]}</summary>
      ${errorMessage ? `<p class="error-message"><strong>Error:</strong> ${escapeHtml(errorMessage)}</p>` : ""}
      ${errorStack ? `<pre class="error-stack">${escapeHtml(errorStack)}</pre>` : ""}
    </details>
  `
      : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)} | Goodfill Care</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font: 15px/1.5 system-ui, -apple-system, 'Noto Sans Thai', sans-serif;
        background: ${colors.background};
        color: ${colors.text};
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      
      .card {
        max-width: 32rem;
        width: 100%;
        text-align: center;
        padding: 2rem;
        background: ${colors.secondaryBg};
        border-radius: 1.5rem;
        box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
        border: 1px solid ${colors.secondaryBorder};
      }
      
      .icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        background: ${colors.errorBg};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
      }
      
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.75rem;
        line-height: 1.3;
      }
      
      p {
        color: ${colors.textSecondary};
        margin: 0 0 1.5rem;
        line-height: 1.6;
      }
      
      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 0.5rem;
      }
      
      a, button {
        padding: 0.625rem 1.25rem;
        border-radius: 2rem;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .primary {
        background: ${colors.primaryBg};
        color: #ffffff;
      }
      
      .primary:hover {
        background: ${colors.primaryHover};
        transform: translateY(-1px);
      }
      
      .secondary {
        background: ${colors.secondaryBg};
        color: ${colors.text};
        border-color: ${colors.secondaryBorder};
      }
      
      .secondary:hover {
        background: ${colors.background};
        transform: translateY(-1px);
      }
      
      .error-details {
        margin-top: 1.5rem;
        text-align: left;
        font-size: 0.75rem;
        border: 1px solid ${colors.errorBorder};
        border-radius: 0.75rem;
        background: ${colors.errorBg};
        overflow: hidden;
      }
      
      .error-details summary {
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-weight: 500;
        color: ${colors.textSecondary};
        user-select: none;
      }
      
      .error-details summary:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .error-message {
        padding: 0.75rem 1rem;
        margin: 0;
        border-top: 1px solid ${colors.errorBorder};
        color: #991b1b;
        background: #fff;
      }
      
      .error-stack {
        padding: 0.75rem 1rem;
        margin: 0;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        font-size: 0.7rem;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
        border-top: 1px solid ${colors.errorBorder};
        background: #fff;
        color: #4b5563;
        max-height: 300px;
        overflow-y: auto;
      }
      
      @media (max-width: 480px) {
        .card {
          padding: 1.5rem;
        }
        
        h1 {
          font-size: 1.25rem;
        }
        
        a, button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">⚠️</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <div class="actions">
        ${actions.join("\n")}
      </div>
      ${errorDetailsHtml}
    </div>
  </body>
</html>`;
}

// ============================================================================
// Simplified Versions
// ============================================================================

export function renderSimpleErrorPage(lang: "th" | "en" = "th"): string {
  return renderErrorPage({ lang });
}

export function renderErrorPageWithDetails(error: unknown, lang: "th" | "en" = "th"): string {
  return renderErrorPage({
    lang,
    showDetails: true,
    error,
  });
}

export function renderNotFoundPage(lang: "th" | "en" = "th"): string {
  const title = lang === "th" ? "ไม่พบหน้าที่คุณค้นหา" : "Page Not Found";
  const message =
    lang === "th"
      ? "หน้าที่คุณต้องการไม่มีอยู่ในระบบ หรืออาจถูกย้ายไปแล้ว"
      : "The page you're looking for doesn't exist or has been moved.";

  return renderErrorPage({
    lang,
    title,
    message,
    showRefresh: false,
    theme: "brand",
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// React Component Version (if needed)
// ============================================================================

export function getErrorPageReactComponent() {
  // This is a string that can be used in React with dangerouslySetInnerHTML
  // For actual React components, create a separate .tsx file
  return {
    __html: renderErrorPage(),
  };
}

// ============================================================================
// Export default
// ============================================================================

export default {
  renderErrorPage,
  renderSimpleErrorPage,
  renderErrorPageWithDetails,
  renderNotFoundPage,
};
