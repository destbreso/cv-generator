# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in CV Generator, please **do not** open a public GitHub issue. Instead, please email **sdev.destbreso@gmail.com** with the following information:

1. **Description** — What is the vulnerability and how could it be exploited?
2. **Location** — Which file(s) or component(s) are affected?
3. **Impact** — What is the potential impact? (data exposure, XSS, etc.)
4. **Steps to Reproduce** — Provide clear steps or a proof of concept if possible
5. **Suggested Fix** — Optional, but helpful if you have a solution in mind

## Response Timeline

- **Initial Response** — Within 48 hours
- **Assessment** — Within 5 business days
- **Fix & Release** — Within 14 days of assessment (depending on severity)
- **Disclosure** — After a patch is available or 90 days have passed

## Security Expectations

CV Generator is designed with privacy and security as core principles:

- **No external servers** — All data stays in your browser (localStorage)
- **No tracking** — No analytics, cookies, or telemetry
- **Local-first AI** — You can run AI models locally with Ollama
- **Open source** — Code is publicly auditable
- **MIT License** — You can fork and self-host

## Known Limitations

1. **localStorage is not encrypted** — If attackers have access to your device, they can read localStorage
2. **Cloud AI providers** — If you use OpenAI, Anthropic, etc., those providers see your CV data during generation
3. **Browser security** — CV Generator is subject to browser security policies and vulnerabilities

## Best Practices

To keep your data safe:

- Use HTTPS when accessing the app
- Keep your browser and OS updated
- Use Ollama for completely private AI generation
- Regularly export and backup your CV data
- Clear your browser data when using shared devices
- Review the Storage Manager regularly to see what's stored locally

## Bug Bounty

We do not currently offer a formal bug bounty program, but we deeply appreciate responsible disclosure. If you find and responsibly disclose a vulnerability, you will be:

- Credited in the SECURITY.md update (if you wish)
- Acknowledged in the repository
- Invited to contribute to the fix

Thank you for helping keep CV Generator secure!
