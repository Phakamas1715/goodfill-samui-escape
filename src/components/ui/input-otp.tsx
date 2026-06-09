import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput> & {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
};

interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  index: number;
  variant?: "default" | "gold" | "emerald";
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: {
    slot: "h-8 w-8 text-sm",
    separator: "mx-1",
  },
  default: {
    slot: "h-10 w-10 text-base",
    separator: "mx-2",
  },
  lg: {
    slot: "h-12 w-12 text-lg",
    separator: "mx-3",
  },
} as const;

const VARIANT_STYLES = {
  default: {
    slot: "border-navy/20 focus:ring-navy/30",
    active: "ring-2 ring-navy/50 border-navy",
    filled: "border-navy/40 bg-navy/5",
    separator: "text-navy/30",
  },
  gold: {
    slot: "border-gold/30 focus:ring-gold/40",
    active: "ring-2 ring-gold border-gold",
    filled: "border-gold/50 bg-gold/5",
    separator: "text-gold/40",
  },
  emerald: {
    slot: "border-emerald/30 focus:ring-emerald/40",
    active: "ring-2 ring-emerald border-emerald",
    filled: "border-emerald/50 bg-emerald/5",
    separator: "text-emerald/40",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, containerClassName, variant = "default", size = "default", ...props }, ref) => {
    const sizeStyle = SIZE_STYLES[size];

    return (
      <OTPInput
        ref={ref}
        containerClassName={cn(
          "flex items-center justify-center gap-2 has-[:disabled]:opacity-50",
          sizeStyle.separator,
          containerClassName,
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    );
  },
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<React.ElementRef<"div">, InputOTPSlotProps>(
  ({ index, className, variant = "default", ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES.default;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center rounded-xl border-2 text-center font-semibold shadow-sm transition-all duration-200",
          "focus-within:scale-105",
          sizeStyle.slot,
          variantStyle.slot,
          isActive && variantStyle.active,
          char && !isActive && variantStyle.filled,
          className,
        )}
        {...props}
      >
        {char || (isActive && !char && <span className="text-transparent">0</span>)}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-px animate-caret-blink bg-current duration-1000" />
          </div>
        )}
      </div>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const variant = "default";
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES.default;

    return (
      <div
        ref={ref}
        role="separator"
        className={cn("flex items-center justify-center", sizeStyle.separator, variantStyle.separator, className)}
        {...props}
      >
        <Minus className="h-4 w-4" />
      </div>
    );
  },
);
InputOTPSeparator.displayName = "InputOTPSeparator";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Input OTP with gold theme for premium verification
 */
const GoldInputOTP = (props: InputOTPProps) => <InputOTP variant="gold" {...props} />;

/**
 * Input OTP with emerald theme for wellness verification
 */
const EmeraldInputOTP = (props: InputOTPProps) => <InputOTP variant="emerald" {...props} />;

/**
 * Input OTP with custom separator
 */
interface InputOTPWithCustomSeparatorProps extends InputOTPProps {
  separator?: React.ReactNode;
}

const InputOTPWithCustomSeparator = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  InputOTPWithCustomSeparatorProps
>(({ separator = <Minus className="h-4 w-4" />, children, ...props }, ref) => (
  <InputOTP ref={ref} {...props}>
    {children}
  </InputOTP>
));
InputOTPWithCustomSeparator.displayName = "InputOTPWithCustomSeparator";

/**
 * Helper to create OTP input with specific pattern
 */
interface PatternOTPProps extends InputOTPProps {
  pattern?: "numeric" | "alphanumeric";
}

const PatternOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, PatternOTPProps>(
  ({ pattern = "numeric", ...props }, ref) => (
    <InputOTP ref={ref} pattern={pattern === "numeric" ? "^[0-9]*$" : "^[A-Za-z0-9]*$"} {...props} />
  ),
);
PatternOTP.displayName = "PatternOTP";

// ============================================================================
// Default Export
// ============================================================================

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  GoldInputOTP,
  EmeraldInputOTP,
  InputOTPWithCustomSeparator,
  PatternOTP,
};
