import { GripVertical, GripHorizontal } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ResizablePanelGroupProps extends React.ComponentProps<typeof Group> {
  variant?: "default" | "gold" | "emerald";
}

interface ResizableHandleProps extends React.ComponentProps<typeof Separator> {
  withHandle?: boolean;
  variant?: "default" | "gold" | "emerald";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    handle: "bg-navy/10 hover:bg-navy/20",
    grip: "text-navy/40",
  },
  gold: {
    handle: "bg-gold/20 hover:bg-gold/30",
    grip: "text-gold/60",
  },
  emerald: {
    handle: "bg-emerald/20 hover:bg-emerald/30",
    grip: "text-emerald/60",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const ResizablePanelGroup = ({ className, variant = "default", ...props }: ResizablePanelGroupProps) => (
  <Group
    className={cn(
      "flex h-full w-full rounded-xl bg-white/50 backdrop-blur-sm",
      "data-[panel-group-direction=vertical]:flex-col",
      "transition-all duration-200",
      className,
    )}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({ withHandle, className, variant = "default", ...props }: ResizableHandleProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const isVertical = props["data-panel-group-direction"] === "vertical";

  return (
    <Separator
      className={cn(
        "relative flex items-center justify-center transition-all duration-200",
        // Horizontal handle (default)
        "w-px after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        // Vertical handle
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1",
        "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2",
        "data-[panel-group-direction=vertical]:after:translate-x-0",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        // Background
        variantStyle.handle,
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex items-center justify-center rounded-md border shadow-sm transition-all duration-200",
            "hover:scale-110",
            isVertical ? "h-4 w-8" : "h-8 w-4",
            variantStyle.handle,
          )}
        >
          {isVertical ? (
            <GripHorizontal className={cn("h-3 w-3", variantStyle.grip)} />
          ) : (
            <GripVertical className={cn("h-3 w-3", variantStyle.grip)} />
          )}
        </div>
      )}
    </Separator>
  );
};

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Resizable panel group with gold theme
 */
const GoldResizablePanelGroup = (props: ResizablePanelGroupProps) => <ResizablePanelGroup variant="gold" {...props} />;

/**
 * Resizable panel group with emerald theme
 */
const EmeraldResizablePanelGroup = (props: ResizablePanelGroupProps) => (
  <ResizablePanelGroup variant="emerald" {...props} />
);

/**
 * Resizable panel with default sizes
 */
const ResizableLayout = ({
  direction = "horizontal",
  defaultSizes = [50, 50],
  minSizes = [10, 10],
  children,
}: {
  direction?: "horizontal" | "vertical";
  defaultSizes?: number[];
  minSizes?: number[];
  children: React.ReactNode[];
}) => {
  const panels = React.Children.toArray(children);

  return (
    <ResizablePanelGroup direction={direction}>
      {panels.map((child, index) => (
        <ResizablePanel key={index} defaultSize={defaultSizes[index]} minSize={minSizes[index]}>
          {child}
        </ResizablePanel>
      ))}
      {panels.length > 1 && <ResizableHandle withHandle />}
    </ResizablePanelGroup>
  );
};
ResizableLayout.displayName = "ResizableLayout";

/**
 * Three-column resizable layout
 */
const ThreeColumnLayout = ({
  left,
  center,
  right,
  defaultSizes = [20, 60, 20],
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  defaultSizes?: [number, number, number];
}) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={defaultSizes[0]} minSize={15}>
        {left}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultSizes[1]} minSize={40}>
        {center}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultSizes[2]} minSize={15}>
        {right}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
ThreeColumnLayout.displayName = "ThreeColumnLayout";

// ============================================================================
// Default Export
// ============================================================================

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  GoldResizablePanelGroup,
  EmeraldResizablePanelGroup,
  ResizableLayout,
  ThreeColumnLayout,
};
