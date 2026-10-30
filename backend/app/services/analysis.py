"""Heuristic URL and domain analysis.

These are transparent pattern-based checks (the same rules the UI documents).
They do not contact any live threat-intelligence database.
"""

import re
from urllib.parse import urlparse

from app.schemes.scan import AnalysisResult

HOSTNAME_RE = re.compile(r"^[a-z0-9.-]+$")

PHISHING_WORDS = (
    "login",
    "verify",
    "secure",
    "account",
    "update",
    "signin",
    "confirm",
    "password",
    "banking",
)

LOOKALIKE_PATTERN = ("paypa1", "g00gle", "amaz0n", "micr0soft", "app1e", "faceb00k")

_NORMALIZE_SCHEME = "https://"


def _risk_from_score(score: int) -> str:
    if score >= 3:
        return "High Risk"
    if score >= 1:
        return "Caution"
    return "Low Risk"


def _parse_url(value: str):
    """Return a parsed URL object or raise ValueError for invalid input."""
    candidate = value.strip()
    if not candidate:
        raise ValueError("Please enter a URL.")
    if "://" not in candidate:
        candidate = _NORMALIZE_SCHEME + candidate
    parsed = urlparse(candidate)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise ValueError("Only valid HTTP and HTTPS URLs are supported.")
    host = parsed.hostname.lower()
    if "." not in host or not HOSTNAME_RE.match(host) or host.startswith("-") or host.endswith("-"):
        raise ValueError("Please enter a valid domain or URL.")
    return parsed


def analyze_url(value: str) -> AnalysisResult:
    parsed = _parse_url(value)
    host = parsed.hostname.lower()
    checks: list[str] = []
    score = 0

    if parsed.scheme != "https":
        checks.append("Warning: this URL uses HTTP instead of HTTPS.")
        score += 1
    else:
        checks.append("URL uses HTTPS.")

    if host.startswith("xn--") or ".xn--" in host:
        checks.append("Hostname contains an internationalized domain label.")
        score += 1

    if len(host.split(".")) >= 5:
        checks.append("Hostname has many subdomains.")
        score += 1

    if parsed.username or parsed.password:
        checks.append("URL contains embedded username or password information.")
        score += 2

    searchable = f"{parsed.path}{'?' + parsed.query if parsed.query else ''}".lower()
    if any(word in searchable for word in PHISHING_WORDS):
        checks.append("URL contains words commonly used in phishing links.")
        score += 1

    if any(part.isdigit() and len(part) >= 4 for part in host.split(".")):
        checks.append("Hostname contains a long sequence of digits.")
        score += 1

    if any(marker in host for marker in LOOKALIKE_PATTERN):
        checks.append("Hostname looks like a look-alike of a well-known brand.")
        score += 2

    if not checks or (score == 0 and len(checks) == 1):
        checks.append("No listed suspicious patterns were detected.")

    risk = _risk_from_score(score)
    return AnalysisResult(
        target=value.strip(),
        scan_type="url",
        risk=risk,
        score=score,
        details=checks,
    )


def analyze_domain(value: str) -> AnalysisResult:
    parsed = _parse_url(value)
    if parsed.path not in ("", "/") or parsed.query or parsed.fragment:
        # Allow full URLs but analyse the host portion only, consistent with the tool.
        pass
    host = parsed.hostname.lower()
    checks: list[str] = []
    score = 0

    if any(part.startswith("xn--") for part in host.split(".")):
        checks.append("Contains an encoded international domain label.")
        score += 1

    if len(host.split(".")) >= 5:
        checks.append("Contains an unusually high number of subdomains.")
        score += 1

    if any(part.isdigit() and len(part) >= 4 for part in host.split(".")):
        checks.append("Contains a long sequence of numbers.")
        score += 1

    if any(marker in host for marker in LOOKALIKE_PATTERN):
        checks.append("Possible look-alike spelling detected.")
        score += 2

    if any(word in host for word in PHISHING_WORDS):
        checks.append("Contains words commonly used in phishing URLs.")
        score += 1

    if not checks:
        checks.append("No suspicious patterns found in this basic check.")

    risk = _risk_from_score(score)
    return AnalysisResult(
        target=host,
        scan_type="domain",
        risk=risk,
        score=score,
        details=checks,
    )
