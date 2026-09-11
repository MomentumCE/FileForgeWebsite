import { ArrowIcon } from "@/components/ArrowIcon";
import { CONTACT_HREF } from "@/lib/site";

const pricingFeatures = [
  "High-resolution scanning",
  "Searchable OCR text layer",
  "Consistent file naming",
  "Folder structure to match your workflow",
  "Color, grayscale & B/W",
  "Large-format & bound docs",
  "Secure chain of custody",
  "Originals returned or shredded",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M4 9.5l3.5 3.5L14 5" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section
      className="blueprint"
      id="pricing"
      aria-labelledby="fileforge-pricing-heading"
    >
      <div className="section-inner">
        <div className="section-label fade-up">Pricing</div>
        <h2
          className="section-headline fade-up fade-up-delay-1"
          id="fileforge-pricing-heading"
        >
          Per-page, volume-based.
        </h2>

        <div className="blueprint-pricing fade-up fade-up-delay-2">
          <div className="blueprint-pricing-header">
            <div className="blueprint-pricing-title">Paper to Digital</div>
            <div className="blueprint-pricing-amount">$0.20</div>
            <div className="blueprint-pricing-per">per page · minimums apply</div>
          </div>

          <div className="blueprint-pricing-features">
            {pricingFeatures.map((feature) => (
              <div key={feature} className="blueprint-pricing-feature">
                <CheckIcon />
                {feature}
              </div>
            ))}
          </div>

          <div className="blueprint-pricing-bottom">
            <div className="blueprint-pricing-note">
              Volume pricing available for large archives - ask during your discovery call.
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }} className="fade-up fade-up-delay-3">
          <a href={CONTACT_HREF} className="btn-primary btn-primary--orange" style={{ display: "inline-flex" }}>
            Learn more
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
