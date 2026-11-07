# Quality review — Classic portfolio (November 2026)

This is a source-level verification record for the standalone Classic portfolio.

## What was checked

- Eight HTML pages: homepage, project progress log, CV and five case studies.
- Language and mobile viewport metadata, one main landmark and main heading per page, skip links and unique IDs.
- Role-based illustration labels, image alt attributes, safe new-tab links and working fragment targets.
- Existing cinematic intro, keyboard skip, replay and reduced-motion protection.
- The independent R.C favicon and Back to Top link anchored before the sticky header, with explicit scroll handling.
- Responsive typography, focus-visible keyboard states and mobile-size tap targets.
- Projects float only when visible in the viewport; inactive tabs pause nonessential motion.
- A printable A4 CV links to the evidence record; no internship promotion.
- CI runs both `node check.mjs` and `node audit-ui.mjs`.

## Limits not disguised as tests

- No authenticated application screenshots, project video recordings or full functional datasets have been uploaded as verified evidence.
- Source checks do not measure Lighthouse, Core Web Vitals, color-contrast scores, hardware/browser rendering or full WCAG conformance.
- Case studies distinguish reported testing, private/local prototypes, a safety-restricted public demo and unverified public deployments.

## Recommended on-device verification

1. Check layout at 320, 375, 768 and 1440 CSS-pixel widths and confirm natural text wrapping.
2. Test the approximately five-second intro, Skip and Replay, reduced motion and Back to Top on actual desktop and mobile browsers.
3. Verify keyboard-only navigation, contrast and all contact links, including the print/PDF workflow.
4. Capture permission-cleared screenshots from genuine working projects, hiding credentials and unrelated people's information.
5. Run Lighthouse using a real browser and retain measured outcomes before stating performance scores.

Classic and Digital Lab continue in separate GitHub repositories.
