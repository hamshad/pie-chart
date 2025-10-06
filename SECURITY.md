# Security Policy

## Supported Versions

The latest published npm version of `@hamshad/pie-chart` receives security updates. Older versions are not maintained.

| Version | Supported |
|---------|-----------|
| latest  | ✅ |
| < latest | ❌ |

## Reporting a Vulnerability

Please DO NOT create a public GitHub issue for security concerns.

Instead, email the maintainer privately at: <ADD SECURITY EMAIL OR GITHUB CONTACT>. If you prefer, you can also use GitHub's private security advisory feature.

### What to Include
Provide as much of the following as possible to help triage efficiently:
- Description and potential impact
- Steps to reproduce / proof of concept
- Affected version(s)
- Possible remediation ideas (if any)

### Response Process
1. You will receive acknowledgment of receipt (typically within 72 hours).
2. The report will be investigated and a severity assigned.
3. A fix will be developed and prepared for release.
4. A new version will be published and you will be credited (unless you prefer otherwise).

## Scope

This library is purely client-side UI code. Typical risks involve:
- DOM-based XSS (e.g., unsafe rendering of untrusted labels)
- Performance-related denial of service (extremely large data sets)

If you discover an issue outside this scope that still poses risk to consumers, please report it.

## Safe Usage Recommendations
- Sanitize or validate any user-generated labels before passing them into the component.
- Limit extremely large data arrays to avoid performance degradation.

Thanks for helping keep the ecosystem safe! 🙏
