#!/usr/bin/env node
// Submits a real test entry to the deployed contact form, then verifies
// it landed in Netlify Forms via the Netlify API. Cleans up the submission
// afterward so the Forms dashboard stays free of test data.
//
// Required env vars:
//   NETLIFY_AUTH_TOKEN  Personal Access Token with form read+write
//   NETLIFY_SITE_ID     Netlify site ID (API ID, not the slug)
//   DEPLOY_URL          Fully-qualified URL to smoke-test (e.g. https://fileforge.com)
//
// Optional env vars:
//   FORM_NAME           Form name (default: "contact")
//   POLL_TIMEOUT_MS     How long to wait for the submission to appear (default: 90000)
//   POLL_INTERVAL_MS    Poll interval (default: 3000)

const NETLIFY_AUTH_TOKEN = mustGetEnv("NETLIFY_AUTH_TOKEN");
const NETLIFY_SITE_ID = mustGetEnv("NETLIFY_SITE_ID");
const DEPLOY_URL = mustGetEnv("DEPLOY_URL").replace(/\/$/, "");
const FORM_NAME = process.env.FORM_NAME ?? "contact";
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS ?? 90_000);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 3_000);

const marker = `smoke-${Date.now()}-${cryptoRandomHex(8)}`;

const submission = {
  "form-name": FORM_NAME,
  first_name: "Smoke",
  last_name: "Test",
  email: "smoke-test@fileforge.invalid",
  organization: "Automated smoke test",
  service: "other",
  message: `This is an automated post-deploy smoke test. Marker: ${marker}. Safe to ignore.`,
};

main().catch((err) => {
  console.error(`✘ Smoke test failed: ${err.message}`);
  process.exit(1);
});

async function main() {
  console.log(`→ Submitting test entry to ${DEPLOY_URL}/__forms.html`);
  console.log(`  Marker: ${marker}`);

  const submitRes = await fetch(`${DEPLOY_URL}/__forms.html`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(submission).toString(),
  });
  if (!submitRes.ok) {
    throw new Error(
      `Form POST returned ${submitRes.status} ${submitRes.statusText}`
    );
  }
  console.log(`  Form POST → ${submitRes.status}`);

  const formId = await findFormId(FORM_NAME);
  console.log(`→ Polling Netlify Forms API for submission (form id ${formId})`);

  const found = await pollForSubmission(formId, marker);
  console.log(`✓ Submission captured (id ${found.id})`);

  console.log(`→ Cleaning up test submission`);
  await deleteSubmission(found.id);
  console.log(`✓ Smoke test passed`);
}

async function findFormId(formName) {
  const forms = await netlifyFetch(`/api/v1/sites/${NETLIFY_SITE_ID}/forms`);
  const match = forms.find((f) => f.name === formName);
  if (!match) {
    const names = forms.map((f) => f.name).join(", ") || "<none>";
    throw new Error(
      `Form named "${formName}" not registered for site. Forms found: ${names}. ` +
        `Has Netlify detected the form yet? Check public/__forms.html and the latest build log.`
    );
  }
  return match.id;
}

async function pollForSubmission(formId, marker) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let attempts = 0;
  while (Date.now() < deadline) {
    attempts += 1;
    for (const state of ["verified", "spam"]) {
      const submissions = await netlifyFetch(
        `/api/v1/forms/${formId}/submissions?state=${state}&per_page=20`
      );
      const hit = submissions.find((s) => containsMarker(s, marker));
      if (hit) {
        if (state === "spam") {
          console.warn(
            "⚠ Submission was flagged as spam by Netlify but was captured. " +
              "Production users may also be hitting the spam filter."
          );
        }
        return hit;
      }
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(
    `Submission with marker "${marker}" not found after ${attempts} polls ` +
      `over ${POLL_TIMEOUT_MS / 1000}s. The form POST may not be reaching ` +
      `Netlify Forms - check the Netlify routing, the static __forms.html ` +
      `stub, and the @netlify/plugin-nextjs config.`
  );
}

function containsMarker(submission, marker) {
  if (typeof submission?.body === "string" && submission.body.includes(marker)) {
    return true;
  }
  const data = submission?.data ?? {};
  for (const value of Object.values(data)) {
    if (typeof value === "string" && value.includes(marker)) return true;
  }
  return false;
}

async function deleteSubmission(id) {
  const res = await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    console.warn(
      `⚠ Could not delete test submission ${id}: ${res.status} ${res.statusText}. ` +
        `Manual cleanup may be required in the Netlify dashboard.`
    );
  }
}

async function netlifyFetch(path) {
  const res = await fetch(`https://api.netlify.com${path}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(
      `Netlify API ${path} → ${res.status} ${res.statusText}: ${await res.text()}`
    );
  }
  return res.json();
}

function authHeaders() {
  return {
    Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
    Accept: "application/json",
  };
}

function mustGetEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(2);
  }
  return value;
}

function cryptoRandomHex(byteLength) {
  return [...crypto.getRandomValues(new Uint8Array(byteLength))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
