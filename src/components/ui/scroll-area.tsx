import * as React from "react";
import { GripVertical, GripHorizontal } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ResizablePanelGroupProps extends React.ComponentProps<typeof Group> {
  variant?: "default" | "gold" | "emerald";
  rounded?: boolean;
  glass?: boolean;
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
    panelBg: "bg-white/50",
  },
  gold: {
    handle: "bg-gold/20 hover:bg-gold/30",
    grip: "text-gold/60",
    panelBg: "bg-gradient-to-br from-gold/5 to-gold-soft/10",
  },
  emerald: {
    handle: "bg-emerald/20 hover:bg-emerald/30",
    grip: "text-emerald/60",
    panelBg: "bg-gradient-to-br from-emerald/5 to-emerald-deep/10",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const ResizablePanelGroup = ({
  className,
  variant = "default",
  rounded = true,
  glass = true,
  ...props
}: ResizablePanelGroupProps) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <Group
      className={cn(
        "flex h-full w-full transition-all duration-200",
        "data-[panel-group-direction=vertical]:flex-col",
        rounded && "rounded-xl",
        glass && variantStyle.panelBg,
        glass && "backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
};

const ResizablePanel = Panel;

const ResizableHandle = ({ withHandle, className, variant = "default", ...props }: ResizableHandleProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const isVertical = (props as Record<string, unknown>)["data-panel-group-direction"] === "vertical";

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
            "hover:scale-110 active:scale-95",
            isVertical ? "h-5 w-8" : "h-8 w-5",
            variantStyle.handle,
          )}
        >
          {isVertical ? (
            <GripHorizontal className={cn("h-3.5 w-3.5", variantStyle.grip)} />
          ) : (
            <GripVertical className={cn("h-3.5 w-3.5", variantStyle.grip)} />
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
    <ResizablePanelGroup orientation={direction}>
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
  variant = "default",
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  defaultSizes?: [number, number, number];
  variant?: "default" | "gold" | "emerald";
}) => {
  return (
    <ResizablePanelGroup orientation="horizontal" variant={variant}>
      <ResizablePanel defaultSize={defaultSizes[0]} minSize={15}>
        {left}
      </ResizablePanel>
      <ResizableHandle withHandle variant={variant} />
      <ResizablePanel defaultSize={defaultSizes[1]} minSize={40}>
        {center}
      </ResizablePanel>
      <ResizableHandle withHandle variant={variant} />
      <ResizablePanel defaultSize={defaultSizes[2]} minSize={15}>
        {right}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
ThreeColumnLayout.displayName = "ThreeColumnLayout";

/**
 * Two-column layout with sidebar
 */
const SidebarLayout = ({
  sidebar,
  content,
  sidebarWidth = 25,
  variant = "default",
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  sidebarWidth?: number;
  variant?: "default" | "gold" | "emerald";
}) => {
  return (
    <ResizablePanelGroup orientation="horizontal" variant={variant}>
      <ResizablePanel defaultSize={sidebarWidth} minSize={15}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle withHandle variant={variant} />
      <ResizablePanel defaultSize={100 - sidebarWidth} minSize={50}>
        {content}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
SidebarLayout.displayName = "SidebarLayout";

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
  SidebarLayout,
};
