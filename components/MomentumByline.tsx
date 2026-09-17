import Image from "next/image";
import { MOMENTUM_URL } from "@/lib/site";

// The "by Momentum CE" half of the FileForge lockup: the word "by", then the
// wave mark stacked over the company name. Sits to the right of the FileForge
// wordmark in smaller type, so the product stays the headline and the parent
// company reads as attribution.
//
// The wave sits to the left of the company name, matching how momentumce.com
// sets its own lockup.
//
// Shared by the nav, the footer brand block and the MomentumCallout heading so
// the three never drift apart. Pass `href` to make it clickable; the nav omits
// it because the whole lockup is already wrapped in a Link to the home page and
// an anchor cannot nest inside another anchor.

// Intrinsic size of public/fileforge/momentum-logo.png, cropped to the mark
// itself (the source on momentumce.com carries ~2:1 of transparent padding,
// which would shrink the wave to a smudge at byline size).
const MARK_W = 358;
const MARK_H = 84;

type Props = {
  /** Renders the byline as a link to momentumce.com when set. */
  href?: string;
  /** Extra classes on the root, e.g. a tone modifier. */
  className?: string;
  /** Width of the wave mark in px; height follows the aspect ratio. */
  markWidth?: number;
  /** Overrides the accessible name (the link variant defaults to the company). */
  label?: string;
};

export function MomentumByline({
  href,
  className = "",
  markWidth = 40,
  label,
}: Props) {
  const content = (
    <>
      <span className="momentum-byline-prefix">by</span>
      <span className="momentum-byline-stack">
        {/* Size travels as a custom property so the default lives with the
            component; narrow-screen media queries override `width` directly,
            since an inline custom property outranks a stylesheet one. */}
        <Image
          src="/fileforge/momentum-logo.png"
          alt=""
          aria-hidden="true"
          width={MARK_W}
          height={MARK_H}
          className="momentum-byline-mark"
          style={{ "--momentum-mark-w": `${markWidth}px` } as React.CSSProperties}
        />
        <span className="momentum-byline-name">Momentum CE</span>
      </span>
    </>
  );

  const classes = `momentum-byline${className ? ` ${className}` : ""}`;

  // The word spacing here is flex `gap`, which is invisible to assistive tech -
  // without an explicit name the parts run together as "byMomentum CE". The
  // link names itself for its destination rather than repeating the "by".
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={label ?? "Momentum CE"}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={classes} aria-label={label ?? "by Momentum CE"}>
      {content}
    </span>
  );
}

// Convenience wrapper for the common case: link it at momentumce.com.
export function MomentumBylineLink(props: Omit<Props, "href">) {
  return <MomentumByline {...props} href={MOMENTUM_URL} />;
}

// The wave on its own, for places that already name Momentum in their own words
// (the hero's "A Momentum CE service" badge) and just want the mark. Shares the
// file's intrinsic dimensions so the aspect ratio is defined in one place.
export function MomentumMark({
  width = 34,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <Image
      src="/fileforge/momentum-logo.png"
      alt=""
      aria-hidden="true"
      width={MARK_W}
      height={MARK_H}
      className={`momentum-byline-mark${className ? ` ${className}` : ""}`}
      style={{ "--momentum-mark-w": `${width}px` } as React.CSSProperties}
    />
  );
}
