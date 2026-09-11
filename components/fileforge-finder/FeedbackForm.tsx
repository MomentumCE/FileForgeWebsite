"use client";

import { useEffect, useState, type FormEvent } from "react";

// Netlify form name. Must stay in sync with the stub in public/__forms.html,
// which is what Netlify's build-time bot actually detects.
const FORM_NAME = "fileforge-feedback";

// FileForge Finder appends ?v=<version> when it opens this page from
// Settings ▸ Feedback, so the version arrives filled in. Anyone can craft that
// link, so treat it as untrusted: accept only something version-shaped and
// short, and drop anything else rather than carrying it into our inbox.
const VERSION_PATTERN = /^[0-9A-Za-z][0-9A-Za-z.\-+]{0,31}$/;

const topicOptions = [
  { value: "", label: "Select a topic" },
  { value: "general", label: "General feedback" },
  { value: "bug", label: "Something isn't working" },
  { value: "feature", label: "Feature request" },
  { value: "search", label: "Search results or accuracy" },
  { value: "performance", label: "Speed or performance" },
  { value: "other", label: "Other" },
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// Feedback form for FileForge Finder users. Same submission path as the
// MomentumCE contact form (components/home/Contact.tsx): POST the encoded
// fields to the static /__forms.html stub so Netlify Forms captures them
// without a full page navigation.
export function FeedbackForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [appVersion, setAppVersion] = useState("");

  // Read on mount rather than with useSearchParams so the page stays a plain
  // static render with no Suspense boundary.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v")?.trim();
    if (v && VERSION_PATTERN.test(v)) setAppVersion(v);
  }, []);

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

  if (status === "success") {
    return (
      <div className="contact-success" role="status" aria-live="polite">
        <div className="contact-success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="contact-success-title">Thanks — we got it.</h2>
        <p className="contact-success-body">
          If you left an email address and your feedback needs a reply,
          we&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/finder/feedback"
      aria-label="FileForge Finder feedback form"
      data-netlify="true"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />

      <div className="form-group">
        <label className="form-label" htmlFor="feedback-topic">
          What&apos;s this about?
        </label>
        <select
          className="form-select"
          id="feedback-topic"
          name="topic"
          defaultValue=""
          required
        >
          {topicOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="feedback-message">
          Your feedback
        </label>
        <textarea
          className="form-textarea"
          id="feedback-message"
          name="message"
          placeholder="For a bug, what you were doing right before it happened helps us reproduce it."
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="feedback-name">
            Name <span className="form-label-optional">optional</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="feedback-name"
            name="name"
            placeholder="Jane Smith"
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="feedback-email">
            Email <span className="form-label-optional">optional</span>
          </label>
          <input
            className="form-input"
            type="email"
            id="feedback-email"
            name="email"
            placeholder="jane@organization.gov"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="feedback-version">
          App version{" "}
          <span className="form-label-optional">
            {appVersion ? "filled in from the app" : "optional"}
          </span>
        </label>
        <input
          className="form-input"
          type="text"
          id="feedback-version"
          name="app_version"
          placeholder="Shown in FileForge Finder under Settings"
          value={appVersion}
          onChange={(e) => setAppVersion(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="form-error">
          Something went wrong sending your feedback. Please try again, or email
          us at support@momentumce.com if it keeps failing.
        </p>
      )}

      <button
        type="submit"
        className="form-submit"
        disabled={status === "submitting"}
        style={status === "submitting" ? { opacity: 0.7, cursor: "wait" } : undefined}
      >
        {status === "submitting" ? "Sending…" : "Send feedback"}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <p className="form-footnote">
        We only use what you send to improve the app and to reply to you.
      </p>
    </form>
  );
}
