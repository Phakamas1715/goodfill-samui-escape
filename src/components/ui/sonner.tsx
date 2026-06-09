import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  formatValue?: (value: number[]) => string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: {
    track: "h-1",
    thumb: "h-3 w-3",
    value: "text-xs",
  },
  default: {
    track: "h-1.5",
    thumb: "h-4 w-4",
    value: "text-sm",
  },
  lg: {
    track: "h-2",
    thumb: "h-5 w-5",
    value: "text-base",
  },
} as const;

const VARIANT_STYLES = {
  default: {
    track: "bg-navy/20",
    range: "bg-navy",
    thumb: "border-navy bg-white hover:scale-110 focus:ring-navy/30",
  },
  gold: {
    track: "bg-gold/20",
    range: "bg-gradient-to-r from-gold to-gold-soft",
    thumb: "border-gold bg-gold/10 hover:scale-110 focus:ring-gold/30",
  },
  emerald: {
    track: "bg-emerald/20",
    range: "bg-gradient-to-r from-emerald to-emerald-deep",
    thumb: "border-emerald bg-emerald/10 hover:scale-110 focus:ring-emerald/30",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      showValue = false,
      formatValue,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || [0]);
    const currentValue = value || internalValue;

    const handleValueChange = (newValue: number[]) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    };

    const formattedValue = formatValue
      ? formatValue(currentValue)
      : currentValue.length === 2
        ? `${currentValue[0]} - ${currentValue[1]}`
        : currentValue[0].toString();

    return (
      <div className="w-full space-y-2">
        {showValue && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{formattedValue}</span>
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          className={cn("relative flex w-full touch-none select-none items-center", className)}
          value={currentValue}
          onValueChange={handleValueChange}
          {...props}
        >
          <SliderPrimitive.Track
            className={cn("relative w-full grow overflow-hidden rounded-full", sizeStyle.track, variantStyle.track)}
          >
            <SliderPrimitive.Range className={cn("absolute h-full", variantStyle.range)} />
          </SliderPrimitive.Track>
          {currentValue.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className={cn(
                "block rounded-full border-2 shadow-sm transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                sizeStyle.thumb,
                variantStyle.thumb,
              )}
            />
          ))}
        </SliderPrimitive.Root>
      </div>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold slider for premium features
 */
const GoldSlider = (props: SliderProps) => <Slider variant="gold" {...props} />;

/**
 * Emerald slider for wellness features
 */
const EmeraldSlider = (props: SliderProps) => <Slider variant="emerald" {...props} />;

/**
 * Range slider for price/duration selection
 */
interface RangeSliderProps extends Omit<SliderProps, "value" | "defaultValue"> {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number[]) => string;
}

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  ({ min, max, step = 1, formatValue, ...props }, ref) => {
    const [value, setValue] = React.useState([min, max]);

    const defaultFormat = (val: number[]) => `${val[0]} - ${val[1]}`;

    return (
      <Slider
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={setValue}
        showValue
        formatValue={formatValue || defaultFormat}
        {...props}
      />
    );
  },
);
RangeSlider.displayName = "RangeSlider";

/**
 * Volume slider with icon
 */
interface VolumeSliderProps extends SliderProps {
  icon?: React.ReactNode;
}

const VolumeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, VolumeSliderProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
        <Slider ref={ref} className="flex-1" {...props} />
      </div>
    );
  },
);
VolumeSlider.displayName = "VolumeSlider";

/**
 * Slider with marks (steps)
 */
interface MarkedSliderProps extends SliderProps {
  marks?: number[];
  markLabels?: string[];
}

const MarkedSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, MarkedSliderProps>(
  ({ marks = [], markLabels = [], className, ...props }, ref) => {
    const marksArray = marks.length ? marks : [];
    const labels = markLabels.length ? markLabels : marksArray.map(String);

    return (
      <div className="w-full">
        <Slider ref={ref} className={className} {...props} />
        {marksArray.length > 0 && (
          <div className="relative mt-1">
            <div className="flex justify-between">
              {marksArray.map((mark, idx) => (
                <div
                  key={idx}
                  className="text-center text-xs text-muted-foreground"
                  style={{ left: `${((mark - (props.min || 0)) / ((props.max || 100) - (props.min || 0))) * 100}%` }}
                >
                  {labels[idx]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
MarkedSlider.displayName = "MarkedSlider";

// ============================================================================
// Default Export
// ============================================================================

export { Slider, GoldSlider, EmeraldSlider, RangeSlider, VolumeSlider, MarkedSlider };
