"use client";

import { useState, type FormEvent } from "react";

// Netlify form name. Must stay in sync with the stub in public/__forms.html,
// which is what Netlify's build-time bot actually detects.
const FORM_NAME = "contact";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// The site's one contact form, rendered at the bottom of the service page (the
// home page) under the #contact anchor that every "Start your free discovery
// call" CTA points at (CONTACT_HREF in lib/site.ts). Same mechanics as the
// Momentum CE site's form: a URL-encoded POST to the static /__forms.html stub
// so Netlify Forms captures it, with success/error states rendered in place.
export function Contact() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const body = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      body.append(key, typeof value === "string" ? value : "");
    }

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="section-inner">
        <div className="contact-header">
          <div className="section-label fade-up">Contact</div>
          <h2
            className="section-headline fade-up fade-up-delay-1"
            id="contact-heading"
          >
            Start your free discovery call
          </h2>
          <p className="contact-header-sub fade-up fade-up-delay-2">
            Tell us about the records you have on paper, or ask anything about
            FileForge Finder. A rough idea of volume and location is plenty to
            start.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-form fade-up fade-up-delay-1">
            {status === "success" ? (
              <div className="contact-success" role="status" aria-live="polite">
                <div className="contact-success-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="contact-success-title">
                  Thank you - your message has been received.
                </h3>
                <p className="contact-success-body">
                  We&apos;ll review it and respond within one business day,
                  including a few times to talk if a call would be useful.
                </p>
              </div>
            ) : (
              <>
                <div className="contact-form-header">
                  <h3 className="contact-form-title">Send us a message</h3>
                  <p className="contact-form-sub">
                    A brief description is enough to start. We&apos;ll follow up
                    with any questions and suggest a time to talk.
                  </p>
                </div>

                <form
                  name={FORM_NAME}
                  method="POST"
                  action="/"
                  aria-label="Contact form"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="form-name" value={FORM_NAME} />
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="first-name">
                        First Name
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="first-name"
                        name="first_name"
                        placeholder="Jane"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="last-name">
                        Last Name
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="last-name"
                        name="last_name"
                        placeholder="Smith"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="jane@organization.gov"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="organization">
                      Organization{" "}
                      <span className="form-label-optional">optional</span>
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="organization"
                      name="organization"
                      placeholder="Your tribe, agency, or company"
                      autoComplete="organization"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="form-textarea"
                      id="message"
                      name="message"
                      placeholder="Roughly how many boxes or file cabinets, where they are, and what you'd like to do with the files once they're digital."
                      required
                    />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="form-error">
                      Something went wrong sending your message. Please try
                      again, or email us directly if it keeps failing.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="form-submit cta-wiggle-target"
                    disabled={status === "submitting"}
                    style={
                      status === "submitting"
                        ? { opacity: 0.7, cursor: "wait" }
                        : undefined
                    }
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <p className="form-footnote">
                    We respond within one business day. Your information is used
                    only to reply to your inquiry.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
