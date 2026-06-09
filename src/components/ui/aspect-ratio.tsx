import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  ratio?: number;
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const COMMON_RATIOS = {
  square: 1 / 1, // 1:1
  video: 16 / 9, // 16:9
  portrait: 3 / 4, // 3:4
  cinema: 21 / 9, // 21:9
  instagram: 4 / 5, // 4:5
  story: 9 / 16, // 9:16
  widescreen: 2 / 1, // 2:1
  golden: 1.618 / 1, // Golden ratio
} as const;

// ============================================================================
// Components
// ============================================================================

/**
 * AspectRatio component that maintains a consistent width/height ratio
 *
 * @example
 * // Basic usage
 * <AspectRatio ratio={16/9}>
 *   <img src="/image.jpg" alt="Video thumbnail" className="object-cover" />
 * </AspectRatio>
 *
 * @example
 * // Using preset ratio
 * <AspectRatio ratio={COMMON_RATIOS.video}>
 *   <video src="/video.mp4" controls />
 * </AspectRatio>
 */
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, children, ...props }, ref) => {
    const paddingBottom = `${(1 / ratio) * 100}%`;

    return (
      <AspectRatioPrimitive.Root
        ref={ref}
        className={cn("relative w-full overflow-hidden", className)}
        style={{ paddingBottom }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </AspectRatioPrimitive.Root>
    );
  },
);
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Image container with aspect ratio and object-fit utilities
 *
 * @example
 * <AspectImage
 *   src="/image.jpg"
 *   alt="Description"
 *   ratio="video"
 *   objectFit="cover"
 * />
 */
interface AspectImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "ratio"> {
  ratio?: keyof typeof COMMON_RATIOS | number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  lazy?: boolean;
}

export function AspectImage({
  src,
  alt,
  ratio = "square",
  objectFit = "cover",
  objectPosition = "center",
  className,
  lazy = true,
  ...props
}: AspectImageProps) {
  const ratioValue = typeof ratio === "string" ? COMMON_RATIOS[ratio as keyof typeof COMMON_RATIOS] : ratio;

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <img
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        className={`size-full ${objectFit === "cover" ? "object-cover" : `object-${objectFit}`}`}
        style={{ objectPosition }}
        {...props}
      />
    </AspectRatio>
  );
}

/**
 * Video container with aspect ratio
 *
 * @example
 * <AspectVideo
 *   src="/video.mp4"
 *   ratio="video"
 *   controls
 * />
 */
interface AspectVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "ratio"> {
  ratio?: keyof typeof COMMON_RATIOS | number;
  poster?: string;
}

export function AspectVideo({ src, ratio = "video", poster, className, controls = true, ...props }: AspectVideoProps) {
  const ratioValue = typeof ratio === "string" ? COMMON_RATIOS[ratio as keyof typeof COMMON_RATIOS] : ratio;

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <video src={src} poster={poster} controls={controls} className="size-full object-cover" {...props} />
    </AspectRatio>
  );
}

/**
 * Map/iframe container with aspect ratio
 *
 * @example
 * <AspectMap
 *   src="https://www.google.com/maps/embed?..."
 *   ratio="square"
 * />
 */
interface AspectMapProps extends Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "ratio"> {
  ratio?: keyof typeof COMMON_RATIOS | number;
}

export function AspectMap({ src, ratio = "square", className, ...props }: AspectMapProps) {
  const ratioValue = typeof ratio === "string" ? COMMON_RATIOS[ratio as keyof typeof COMMON_RATIOS] : ratio;

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <iframe src={src} className="size-full" allowFullScreen loading="lazy" {...props} />
    </AspectRatio>
  );
}

/**
 * Card with aspect ratio image and content overlay
 *
 * @example
 * <AspectCard
 *   image="/image.jpg"
 *   title="Wellness Retreat"
 *   description="Experience the ultimate relaxation"
 *   ratio="portrait"
 * />
 */
interface AspectCardProps {
  image: string;
  title?: string;
  description?: string;
  ratio?: keyof typeof COMMON_RATIOS | number;
  overlay?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function AspectCard({
  image,
  title,
  description,
  ratio = "square",
  overlay = true,
  className,
  onClick,
  children,
}: AspectCardProps) {
  const ratioValue = typeof ratio === "string" ? COMMON_RATIOS[ratio as keyof typeof COMMON_RATIOS] : ratio;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      <AspectRatio ratio={ratioValue}>
        <img
          src={image}
          alt={title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />}
        {(title || description || children) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-white/80 mt-1">{description}</p>}
            {children}
          </div>
        )}
      </AspectRatio>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get common ratio value by name
 */
export function getRatio(ratio: keyof typeof COMMON_RATIOS | number): number {
  if (typeof ratio === "number") return ratio;
  return COMMON_RATIOS[ratio];
}

/**
 * Get CSS padding-bottom value for a ratio
 */
export function getRatioPadding(ratio: number): string {
  return `${(1 / ratio) * 100}%`;
}

// ============================================================================
// Default Export
// ============================================================================

export { AspectRatio, COMMON_RATIOS };

export default AspectRatio;
