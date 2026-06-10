import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: "default" | "gold" | "emerald" | "glass";
  size?: "sm" | "default" | "lg";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "h-8 px-2 py-1 text-sm rounded-lg",
  default: "h-10 px-3 py-2 text-base rounded-xl",
  lg: "h-12 px-4 py-3 text-lg rounded-xl",
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
    normal:
      "border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 focus:ring-white/40",
    error: "border-coral/50 bg-coral/20 backdrop-blur-sm focus:ring-coral/30",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "default",
      size = "default",
      error = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];
    const stateStyle = error ? variantStyle.error : variantStyle.normal;

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full transition-all duration-200",
            "border-2 bg-transparent shadow-sm",
            "placeholder:text-muted-foreground/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            sizeStyle,
            stateStyle,
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            className,
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {rightIcon && !error && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        {error && !rightIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-4 w-4 text-coral"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Input with gold theme for premium fields
 */
const GoldInput = (props: InputProps) => <Input variant="gold" {...props} />;

/**
 * Input with emerald theme for wellness fields
 */
const EmeraldInput = (props: InputProps) => <Input variant="emerald" {...props} />;

/**
 * Input with glass effect for hero sections
 */
const GlassInput = (props: InputProps) => <Input variant="glass" {...props} />;

/**
 * Password input with toggle visibility
 */
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

/**
 * Input with character counter
 */
interface InputWithCounterProps extends InputProps {
  maxLength: number;
  currentLength?: number;
}

const InputWithCounter = React.forwardRef<HTMLInputElement, InputWithCounterProps>(
  ({ maxLength, currentLength, ...props }, ref) => {
    const length = currentLength ?? (props.value as string)?.length ?? 0;

    return (
      <div className="relative">
        <Input ref={ref} {...props} />
        <div className="absolute bottom-0 right-3 top-auto translate-y-full pt-1 text-xs text-muted-foreground">
          {length}/{maxLength}
        </div>
      </div>
    );
  },
);
InputWithCounter.displayName = "InputWithCounter";

// ============================================================================
// Default Export
// ============================================================================

export { Input, GoldInput, EmeraldInput, GlassInput, PasswordInput, InputWithCounter };
