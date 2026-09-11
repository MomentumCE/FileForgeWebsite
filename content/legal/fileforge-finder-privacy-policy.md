# FileForge Finder and FileForge Finder+ - Privacy Policy

**Version:** 2.0
**Effective Date:** August 6, 2026
**Supersedes:** Version 1.0 (July 23, 2026)
**Applies to:** FileForge Finder (free edition), FileForge Finder+ (paid edition), and the FileForge pages of momentumce.com

---

## 1. Introduction and Scope

Momentum CE Inc. ("we," "us," or "our") is committed to being accurate and transparent about how information is handled in connection with FileForge Finder and FileForge Finder+ (each an "edition," and together the "Software").

This Policy covers three distinct contexts, and the answers differ in each:

| Context | What it is | Do we receive your data? |
|---|---|---|
| **The installed Software** | The desktop application running on your device | **No files, no file contents, no search activity.** Limited connections for update checks and, for Finder+, sign-in and entitlement (Section 4) |
| **Our website and account system** | momentumce.com, sign-in, subscription purchase, installer downloads | **Yes** — account, billing, and download information (Section 5) |
| **Direct communications** | Support requests, contact forms, early-access sign-up | **Yes** — what you choose to send us (Section 5.3) |

The distinction that matters most: **the documents you index, search, preview, and export with the Software never reach us.** Everything the Software derives from your files — the index, the extracted text, your search queries, sensitive-data flags, the activity log, and your exports — stays on your own device. What we do receive is limited to the account, billing, download, and update-check information described in Sections 4 and 5.

This Policy applies to all users authorized by the licensed organization to use the Software, including records, enrollment, finance, and grants personnel, and the staff of government and tribal government offices. By installing or using the Software, or by creating an account, you acknowledge that you have read and understood this Privacy Policy.

For government and tribal government users, we recognize that data sovereignty and the protection of sensitive and sovereign information are of particular importance. Because your files, and the data the Software derives from them, remain on your own systems, the Software's architecture is designed to be consistent with data-governance and data-sovereignty principles. See Section 12.

## 2. Information the Software Does Not Collect

The Software is designed with a local-first architecture. The following categories of information are **not** collected by, transmitted to, or accessible by Momentum CE Inc.:

- The files stored on your device, or the contents of those files
- The full text the Software extracts from your documents in order to make them searchable
- File names, folder paths, sizes, dates, or other file metadata indexed by the Software
- Your search queries and search history
- Files, records packages, spreadsheet manifests, extracted-text bundles, or clipboard contents you generate or export using the Software
- The Software's sensitive-data flags, or the personal information — such as identification numbers, dates of birth, telephone numbers, or payment-card numbers — contained within your documents
- The contents of the Software's activity (audit) log, including the search queries, file paths, and operator identifiers it records
- Behavioral analytics or feature-usage tracking from inside the installed application
- Your device's operating-system user name or computer name

We do not sell or rent your personal information, and we do not share it with advertisers or data brokers. We have no access to the files or document data you manage using the Software.

**What this section does not cover.** This list describes the installed application. It does not describe our website, account, and download systems, which do receive limited information — including a network-derived IP address at the moment of a request. See Sections 4 and 5.

## 3. Plain-Language Summary of What We Do Receive

- **From both editions:** an update check that reveals your edition, platform, and — as with any internet request — your IP address at that moment. No files, no searches, no account identifier for the free edition.
- **From Finder+ only:** your account sign-in and entitlement status, so we can confirm you are entitled to the build and to updates.
- **When you download an installer:** an anonymous download record (Section 5.2). It does not identify you, even if you were signed in.
- **When you buy Finder+:** account and billing information, handled by our account and payment providers (Section 5.1).
- **When you contact us or sign up for early access:** whatever you send us (Section 5.3).
- **When you browse our website:** cookies and third-party scripts as described in Section 5.4.

## 4. Network Activity of the Installed Software

The Software is designed to operate locally, and implements measures intended to block and record network requests originating from its user interface. **It is not, however, a fully offline or air-gapped application.** The circumstances in which it makes or enables outbound network connections are listed below. **None of them transmits your files, your document content, or your search activity.**

### 4.1 Update Checks (both editions)

**Both** FileForge Finder and FileForge Finder+ contact our update service before checking for a new version, and may download and install updates. This request tells us:

- Which edition and platform you are running, so we can point the check at the correct release folder
- Your current version, so the check can determine whether a newer one exists
- Your IP address, which — as with any internet request — is visible to us and to our hosting and content-delivery providers at the moment of the request
- For Finder+, an account or entitlement identifier, so we can confirm you are eligible for the update

We use this information only to serve the update check, to authorize the download, and to protect the endpoint from abuse. To rate-limit abuse we store a **salted, irreversible cryptographic digest** of the requesting IP address, not the address itself; that digest cannot be turned back into an IP address. We do not build usage profiles, installation counts tied to individuals, or behavioral analytics from update checks, and we do not retain a per-user history of them.

Where the Software provides a setting to disable or defer automatic updates, you may use it. If you do, you take on responsibility for keeping the Software current, including for security fixes.

### 4.2 Finder+ Sign-In and Entitlement

Finder+ requires an account and an active subscription or lifetime license. When you sign in from the desktop application, the application opens your web browser to our sign-in page, our account provider authenticates you, and a one-time authorization code is exchanged for an access token that is returned to the application and stored on your device. Through this process we receive the account information described in Section 5.1 and learn that your account signed in.

The free Finder edition does not require an account as of the Effective Date. **If we introduce an account or sign-in requirement for the free edition, we will update this Policy and provide notice before doing so.**

### 4.3 Installer Downloads

When you download either installer from our website, we record a download event as described in Section 5.2.

### 4.4 Optional AI Model Download (Finder+ only)

Finder+ offers optional artificial-intelligence features that run on your own device. If you enable these features and the required model files are not already present, the Software will, after you confirm, perform a one-time download of those model files from a third-party host. This is a download only: it retrieves model files and does not upload your files, search queries, document content, or license information. The host operates under its own privacy and security practices, and your IP address is visible to it during the download. If you do not enable AI features, no such download occurs.

### 4.5 On-Device AI Processing (Finder+ only)

When you use the optional AI features, the document text and rendered document images they operate on are processed by a component that runs locally on your own device, over your computer's internal loopback interface. This information is not transmitted off your device by the Software, and is not transmitted to us or to any third party.

### 4.6 External Links

If you follow a link within the Software, such as a link to our website, the Software opens it in your device's external web browser. Your subsequent browsing is governed by the privacy practices of the site you visit and by Section 5 of this Policy where that site is ours.

## 5. Information We Collect Through Our Website, Accounts, and Downloads

### 5.1 Account, Subscription, and Billing Information

To purchase and use Finder+ you create an account. Account registration, authentication, subscription management, and payment processing are performed for us by a third-party account and billing provider (Section 8). Through this we receive:

- Your name and email address
- Your account and subscription status, plan, term (annual or lifetime), and renewal or cancellation state
- Billing records such as invoices, amounts, dates, and payment status
- Any organization or profile details you choose to provide

**We do not receive or store your full payment card number.** Card details are collected and processed by our provider's payment processor under its own security practices; we see only limited information such as the card type and last four digits, and the transaction result.

### 5.2 Installer Download Records

When an installer is downloaded from our website, we record one event containing:

- The date and time
- The platform served (Mac, Windows, or Linux) and which build (Finder or Finder+)
- How the download was authorized (public download, password-gated page, or signed-in subscriber)
- Which page or button the download came from
- Your **country** as reported by our hosting provider — country only, never a full location
- The referring URL, if your browser sent one
- A **salted, irreversible digest** of your IP address — not the address itself

**Download records do not identify you.** Even when you download Finder+ while signed in, we do not store your name, email address, or account identifier alongside the download. Our systems verify your entitlement in order to authorize the download, and then record only the anonymous fields above.

We use these records to count downloads, to understand which platforms and pages matter, to enforce rate limits, and to detect abuse of the download endpoint. We do not use them for advertising and do not sell them.

### 5.3 Contact Forms, Support, and Early-Access Sign-Up

If you submit our contact form we receive the information you enter, which may include your first and last name, email address, organization, the service you are interested in, and your message. If you sign up for early access or a mailing list, we receive your email address and any other details the sign-up form requests. If you contact support, we receive your message and whatever you choose to include in it.

**Please do not send us protected health information, criminal-justice information, personal data about third parties, or other regulated or confidential data** — including inside screenshots, log files, exported records packages, or sample documents attached to a support request. We do not need it to help you, and our support channels are not designed to hold it. Redact before sending.

### 5.4 Cookies and Third-Party Scripts on Our Website

Our website loads a third-party account and billing script on its pages in order to provide sign-in, account management, subscription checkout, support, and sign-up forms. That script and our website may set cookies or use similar local-storage technologies to keep you signed in, remember your session, and operate those forms. Some of these are strictly necessary for the account features to function; disabling them will prevent sign-in and checkout from working.

**Our website runs no analytics product.** We do not use Google Analytics or any comparable web-analytics, session-recording, advertising, or data-broker service, and we do not track you across other websites. The cookies set on our site exist to operate sign-in, checkout, support, and sign-up forms. If we add an analytics product in the future, we will update this Policy and Section 8 before doing so.

### 5.5 Hosting and Security Logs

Our website and API endpoints are operated on third-party hosting infrastructure. Like any internet service, that infrastructure processes request metadata — including IP address, user agent, timestamp, and requested URL — in order to route traffic, serve content, apply rate limits, and defend against attack. We also store rate-limiting counters keyed to the salted IP digests described above.

## 6. How We Use Information

We use the information described in Section 5 to:

- Provide, maintain, and secure the Software, our website, and your account
- Authenticate you and verify your entitlement to Finder+ downloads, features, and updates
- Process purchases, renewals, cancellations, and refunds, and keep billing records
- Deliver installers and updates, and confirm eligibility for them
- Provide support and respond to your inquiries
- Count downloads and understand which platforms and pages to prioritize
- Detect, prevent, and investigate abuse, fraud, license circumvention, and security incidents
- Send you transactional messages about your account, purchase, renewal, security, or material changes to our terms or this Policy
- Send you product or marketing email **only where you have signed up for it or where permitted by law**, and always with a way to unsubscribe
- Comply with law, enforce our [Terms of Use](https://momentumce.com/fileforge/terms), and establish or defend legal claims

We do not use your information for automated decision-making that produces legal effects, and we do not use it to train artificial-intelligence models.

## 7. Retention

We keep information only as long as we need it:

- **Account and subscription records:** for the life of your account, and afterward for up to seven (7) years as needed for tax, accounting, audit, and legal-claim purposes.
- **Download records:** these contain no information identifying you (Section 5.2), so they are retained as aggregate product statistics and are not linked to you.
- **Rate-limiting counters and salted IP digests:** short-lived, retained only as long as needed to enforce the applicable limit.
- **Contact form, support, and early-access records:** up to twenty-four (24) months after our last correspondence with you, or until you ask us to delete them, whichever comes first.
- **Data stored by the installed Software on your device:** retained by you, under your control, subject to the retention setting in the Software's activity log. We hold no copy and cannot delete it for you.

Where we are required to keep information longer by law, or need it to resolve a dispute or enforce our agreements, we keep it for that purpose only.

## 8. Third-Party Services and Processors

We keep third-party reliance to a minimum. Those we do use are:

| Provider | Role | What it receives |
|---|---|---|
| **Outseta** | Account creation, sign-in, subscription management, checkout, support and sign-up forms, and the account widgets on our website | Name, email, account and subscription status, billing records; sets cookies on our site |
| **Stripe** (engaged through Outseta) | Processes card payments | Your payment card details, which we do not receive |
| **Netlify** | Hosts our website and API endpoints; provides country-level geo, contact-form handling, and the storage used for download counts and rate limits | Request metadata including IP address and user agent |
| **Amazon Web Services** (CloudFront and S3) | Stores and distributes installers and update feeds via signed, expiring URLs | Request metadata including IP address for download and update requests |
| Third-party AI model host (Finder+, optional) | Hosts the model files downloaded if you enable AI features | Your IP address during the one-time download |

Each provider processes information under its own terms and privacy practices. We engage them to provide these services to us, not to use your information for their own marketing.

Third-party software components bundled with the Software — used, for example, to read PDFs and other document formats and to perform optical character recognition — run locally on your device and do not transmit your data. The optional artificial-intelligence model is a third-party model subject to its own license terms.

If you choose to send files or content from the Software to a separate third-party application, that transfer is governed by that third party's practices, not this Policy.

## 9. Files and Local Storage

All data the Software creates or maintains is stored locally on your own device. This includes a file-path index of the locations you choose to index; a content database containing the full text the Software extracts from your documents to enable searching; an activity (audit) log; configuration files; and, for Finder+, your stored access token and entitlement status. Exported output is saved to local locations you choose.

Momentum CE Inc. does not have access to, does not back up, and does not retain any copy of these files or the data they contain. You are solely responsible for the security, backup, and management of all locally stored data.

To support its tamper-evident recordkeeping features, the Software records an operating-system user and computer name (for example, in the form "user@computer") in its activity log, and embeds the same identifier in the records packages you export. This identifier is stored and exported locally as part of your own records and is not transmitted to Momentum CE Inc.

Government and tribal government users retain full data sovereignty over all files, records, personnel, grant, and program data stored by or processed with the Software. This data is subject to your organization's applicable data-governance policies, and nothing in this Privacy Policy limits or affects those rights.

## 10. Data Security

Because the files and document data are stored locally on your device or network, the security of that data is primarily your responsibility. We strongly recommend:

- Restricting access to the devices and network folders where the Software and its data are stored
- Enabling operating-system full-disk encryption (such as BitLocker or FileVault)
- Maintaining current antivirus and operating-system security updates
- Implementing regular, secured backups of any data and exported output you wish to retain, stored in a separate location
- Using strong access credentials and screen-lock policies
- Controlling physical access to workstations used to run the Software
- Safeguarding your Finder+ account credentials and not sharing them

The Software applies encryption at rest to certain of its local data stores — its activity (audit) log and its file-path index — using the operating system's secure-storage facilities. **However, the Software's content database, which contains the full text extracted from your documents, is not encrypted at rest by the Software.** For this reason, operating-system full-disk encryption and the access controls above are important safeguards for the confidentiality of your data.

As an additional safeguard, the Software includes a mechanism that blocks and records network requests originating from its user interface, and provides an in-application trust panel and a savable privacy report describing where its data is stored and how many such requests have been blocked. This mechanism does not block the update check and entitlement activity described in Section 4, which are necessary functions of the Software.

For the information we do hold, we use measures appropriate to its nature, including signed, expiring download URLs, storage of IP addresses only as salted digests, reliance on established providers for authentication and payment, and not storing card numbers ourselves. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.

We address security issues in Software updates as needed and recommend keeping the Software current. If you discover a security concern, please contact us at [privacy@momentumce.com](mailto:privacy@momentumce.com).

If we become aware of a security breach affecting personal information we hold, we will notify affected individuals and any applicable regulators as required by law, and without undue delay.

## 11. Data Exports and Clipboard Use

The Software allows you to export and copy data for your own use, including copied files, spreadsheet (.xlsx) summaries, self-contained records packages, consolidated extracted-text bundles (to a file or to your device's clipboard), audit-trail exports, and a plain-text privacy report. You can also drag files out of the Software into other applications. All of these actions are user-initiated and save to local destinations you choose. Exported and copied content is not transmitted to or received by Momentum CE Inc.

Exported output may contain the full text of your documents and may include an operating-system user and computer name identifying the operator who created it. If you drag files or content into another application — including a separate, third-party artificial-intelligence assistant — that content leaves the Software through your own action and becomes subject to the practices of the application you send it to. You are solely responsible for how exported, copied, or dragged content is subsequently used, stored, shared, or disclosed. We recommend treating it with the same care as the underlying files, consistent with your organization's data-handling policies and any applicable regulatory requirements.

## 12. Government and Tribal Data Sovereignty

We recognize the unique legal and sovereign status of tribal government clients, and the data-governance obligations of public-sector organizations generally. All files, records, personnel, grant, and program data processed with the Software by these users remain under the exclusive control of the organization on whose systems the Software is installed. Momentum CE Inc. has no access to this data and makes no claim over it.

Where a tribal data-governance policy, data-sharing agreement, intergovernmental data compact, or public-records or records-retention obligation applies to information managed through the Software, those instruments govern the handling of that information and take precedence over the general provisions of this Privacy Policy. We are committed to supporting data sovereignty and will work with clients to address specific data-governance requirements, including through a signed agreement where appropriate.

**Note on account information.** Where a tribal or government organization purchases Finder+, the account and billing information in Section 5.1 is held by us and our providers, and is not covered by the "no access" statement above, which applies to the data you process with the Software. If your data-governance requirements restrict where that account information may be stored or processed, contact us before purchase so we can address it.

## 13. Children's Privacy

The Software is intended for use by professional and organizational users. It is not directed at or designed for use by individuals under the age of 18, and we do not knowingly collect personal information from minors. Accounts may only be created by individuals 18 or older.

We recognize that files you index or process with the Software — for example, enrollment or program records — may themselves contain information about minors. Any such information remains on your own systems under your control, and you are responsible for handling it in accordance with applicable law and your organization's policies. If you believe a minor has provided personal information to us directly, please contact us at the address below and we will delete it.

## 14. Your Privacy Rights

Depending on where you live, you may have rights with respect to the personal information we hold about you — the account, billing, download, and communication information described in Section 5. Subject to applicable law and to verification of your identity, you may request to:

- **Know and access** the personal information we hold about you
- **Correct** inaccurate personal information
- **Delete** your personal information
- **Obtain a portable copy** of information you provided to us
- **Opt out** of marketing email at any time, using the unsubscribe link or by contacting us
- **Opt out** of the sale of personal information or of targeted advertising — neither of which we engage in
- **Appeal** a decision we make on your request, where applicable law provides for an appeal

To exercise any of these rights, contact us at [privacy@momentumce.com](mailto:privacy@momentumce.com). We will respond within the period required by applicable law. We will not discriminate against you for exercising a privacy right. If we deny a request, we will explain why and how to appeal.

**Data stored on your own device.** Rights with respect to the files and data stored locally by the Software — including any personal information contained in your documents, the content database, and the activity log — cannot be exercised through us, because we do not hold that data. It is held by you or your organization on your own systems, and requests concerning it should be directed to your organization.

**If you are an individual whose information appears inside a customer's documents,** we are not the controller of that information and have no access to it. Please direct your request to the organization that holds the records.

**Authorized agents.** You may use an authorized agent to submit a request where applicable law permits; we may ask for proof of authorization.

## 15. International Users and Data Transfers

We are based in the United States, and the information described in Section 5 is stored and processed in the United States by us and our providers. If you access our website or purchase from outside the United States, you understand that your information will be transferred to and processed in the United States, where privacy laws may differ from those in your jurisdiction. The Software itself processes your documents only on your own device, wherever that device is located.

We currently offer the Software and sell subscriptions to customers in the United States. We do not target our offering to individuals in the European Economic Area or the United Kingdom. If that changes, we will update this Policy before doing so.

## 16. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in the Software, our practices, or applicable law. When we do, we will increment the version number and update the Effective Date above, and publish the revised Policy at [momentumce.com/fileforge/privacy](https://momentumce.com/fileforge/privacy).

For material changes — including any change that expands what we collect or how we use it — we will provide notice by reasonable means, which may include in-application notice, notice at your next sign-in or renewal, notice in the documentation accompanying a Software update, or email to the address associated with your account. Where the change requires your consent under applicable law, we will obtain it before the change applies to you.

We encourage you to review this Policy periodically. The version and effective date at the top indicate when it was last revised.

## 17. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your information, please contact us at:

Momentum CE Inc.
320 E Vine Dr #316 Fort Collins, CO 80524
[privacy@momentumce.com](mailto:privacy@momentumce.com)
