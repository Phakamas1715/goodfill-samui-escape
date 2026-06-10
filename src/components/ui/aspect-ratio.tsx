import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface AspectRatioProps extends React.ComponentPropsWithoutRef<
  typeof AspectRatioPrimitive.Root
> {
  ratio?: number;
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const COMMON_RATIOS = {
  square: 1 / 1, // 1:1
  video: 16 / 9, // 16:9
  portrait: 3 / 4, // 3:4
  cinema: 21 / 9, // 21:9
  instagram: 4 / 5, // 4:5
  story: 9 / 16, // 9:16
  widescreen: 2 / 1, // 2:1
  golden: 1.618 / 1, // Golden ratio
  poster: 2 / 3, // 2:3 (movie poster)
  ultrawide: 32 / 9, // 32:9
} as const;

export type CommonRatioKey = keyof typeof COMMON_RATIOS;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get common ratio value by name or return number if already a number
 */
export function getRatio(ratio: CommonRatioKey | number): number {
  if (typeof ratio === "number") return ratio;
  return COMMON_RATIOS[ratio];
}

/**
 * Get CSS padding-bottom value for a ratio
 */
export function getRatioPadding(ratio: number): string {
  return `${(1 / ratio) * 100}%`;
}

/**
 * Validate if a ratio is within reasonable bounds
 */
export function isValidRatio(ratio: number): boolean {
  return ratio > 0 && ratio < 10;
}

// ============================================================================
// Main Component
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
    const paddingBottom = getRatioPadding(ratio);

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
export interface AspectImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "ratio"> {
  ratio?: CommonRatioKey | number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  lazy?: boolean;
  fallbackSrc?: string;
}

export function AspectImage({
  src,
  alt,
  ratio = "square",
  objectFit = "cover",
  objectPosition = "center",
  className,
  lazy = true,
  fallbackSrc,
  onError,
  ...props
}: AspectImageProps) {
  const ratioValue = getRatio(ratio);
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <img
        src={imgSrc}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        className={cn("size-full", {
          "object-cover": objectFit === "cover",
          "object-contain": objectFit === "contain",
          "object-fill": objectFit === "fill",
          "object-none": objectFit === "none",
          "object-scale-down": objectFit === "scale-down",
        })}
        style={{ objectPosition }}
        onError={handleError}
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
export interface AspectVideoProps extends Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "ratio"
> {
  ratio?: CommonRatioKey | number;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function AspectVideo({
  src,
  ratio = "video",
  poster,
  className,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  ...props
}: AspectVideoProps) {
  const ratioValue = getRatio(ratio);

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="size-full object-cover"
        {...props}
      />
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
export interface AspectMapProps extends Omit<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  "ratio"
> {
  ratio?: CommonRatioKey | number;
  title?: string;
}

export function AspectMap({
  src,
  ratio = "square",
  className,
  title = "Map",
  ...props
}: AspectMapProps) {
  const ratioValue = getRatio(ratio);

  return (
    <AspectRatio ratio={ratioValue} className={className}>
      <iframe
        src={src}
        title={title}
        className="size-full"
        allowFullScreen
        loading="lazy"
        {...props}
      />
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
export interface AspectCardProps {
  image: string;
  title?: string;
  description?: string;
  ratio?: CommonRatioKey | number;
  overlay?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  imageClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
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
  imageClassName,
  overlayClassName,
  contentClassName,
}: AspectCardProps) {
  const ratioValue = getRatio(ratio);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <AspectRatio ratio={ratioValue}>
        <img
          src={image}
          alt={title}
          className={cn(
            "size-full object-cover transition-transform duration-700 group-hover:scale-110",
            imageClassName,
          )}
        />
        {overlay && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent",
              overlayClassName,
            )}
          />
        )}
        {(title || description || children) && (
          <div className={cn("absolute bottom-0 left-0 right-0 p-4 text-white", contentClassName)}>
            {title && <h3 className="font-display text-lg font-semibold leading-tight">{title}</h3>}
            {description && (
              <p className="text-sm text-white/80 mt-1 line-clamp-2">{description}</p>
            )}
            {children}
          </div>
        )}
      </AspectRatio>
    </div>
  );
}

/**
 * Lazy loading wrapper for images with aspect ratio
 */
export function LazyAspectImage(props: AspectImageProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible && <AspectImage {...props} />}
      {!isVisible && (
        <div
          className={cn("bg-muted animate-pulse rounded", props.className)}
          style={{ aspectRatio: getRatio(props.ratio || "square") }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export { AspectRatio };

export default AspectRatio;
