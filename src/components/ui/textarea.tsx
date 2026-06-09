import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: "default" | "gold" | "emerald" | "glass";
  size?: "sm" | "default" | "lg";
  error?: boolean;
  showCount?: boolean;
  maxLength?: number;
  label?: string;
  helper?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: {
    textarea: "min-h-[60px] text-sm px-2 py-1.5 rounded-lg",
  },
  default: {
    textarea: "min-h-[80px] text-base px-3 py-2 rounded-xl",
  },
  lg: {
    textarea: "min-h-[120px] text-lg px-4 py-3 rounded-xl",
  },
} as const;

const VARIANT_STYLES = {
  default: {
    normal: "border-navy/20 bg-white/90 focus:ring-navy/30 focus:border-navy",
    error: "border-coral/50 bg-coral/5 focus:ring-coral/30",
  },
  gold: {
    normal: "border-gold/30 bg-gold/5 focus:ring-gold/40 focus:border-gold",
    error: "border-coral/50 bg-coral/5 focus:ring-coral/30",
  },
  emerald: {
    normal: "border-emerald/30 bg-emerald/5 focus:ring-emerald/40 focus:border-emerald",
    error: "border-coral/50 bg-coral/5 focus:ring-coral/30",
  },
  glass: {
    normal: "border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 focus:ring-white/40",
    error: "border-coral/50 bg-coral/20 backdrop-blur-sm focus:ring-coral/30",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      error = false,
      showCount = false,
      maxLength,
      label,
      helper,
      id,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];
    const stateStyle = error ? variantStyle.error : variantStyle.normal;
    const [charCount, setCharCount] = React.useState(typeof value === "string" ? value.length : 0);

    const textareaId = id || React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    const currentValue = typeof value === "string" ? value : "";
    const currentLength = currentValue.length;
    const isNearLimit = maxLength && currentLength > maxLength * 0.8;
    const isOverLimit = maxLength && currentLength > maxLength;

    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className={cn("text-sm font-medium transition-colors", error ? "text-coral" : "text-navy")}
            >
              {label}
            </label>
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs transition-colors",
                  isOverLimit ? "text-coral" : isNearLimit ? "text-gold" : "text-muted-foreground",
                )}
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "w-full border-2 bg-transparent shadow-sm transition-all duration-200",
            "placeholder:text-muted-foreground/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-vertical",
            sizeStyle.textarea,
            stateStyle,
            className,
          )}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />
        {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
        {error && (
          <p className="text-xs text-coral animate-in fade-in-0 slide-in-from-top-1">
            {error === true ? "This field is required" : typeof error === "string" ? error : "Invalid input"}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Textarea with gold theme
 */
const GoldTextarea = (props: TextareaProps) => <Textarea variant="gold" {...props} />;

/**
 * Textarea with emerald theme
 */
const EmeraldTextarea = (props: TextareaProps) => <Textarea variant="emerald" {...props} />;

/**
 * Textarea with glass effect
 */
const GlassTextarea = (props: TextareaProps) => <Textarea variant="glass" {...props} />;

/**
 * Auto-resizing textarea
 */
interface AutoResizeTextareaProps extends TextareaProps {
  minRows?: number;
  maxRows?: number;
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ minRows = 2, maxRows = 6, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [minRows, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight();
      if (onChange) onChange(e);
    };

    return (
      <Textarea
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          adjustHeight();
        }}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
AutoResizeTextarea.displayName = "AutoResizeTextarea";

// ============================================================================
// Default Export
// ============================================================================

export { Textarea, GoldTextarea, EmeraldTextarea, GlassTextarea, AutoResizeTextarea };
