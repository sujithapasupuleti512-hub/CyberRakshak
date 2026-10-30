"""URL / domain analysis tests."""

from app.services.analysis import analyze_domain, analyze_url
import pytest


def test_clean_https_url_is_low_risk():
    result = analyze_url("https://www.example.com")
    assert result.risk == "Low Risk"
    assert result.score == 0


def test_http_url_is_caution():
    result = analyze_url("http://example.com")
    assert result.risk == "Caution"
    assert result.score >= 1


def test_lookalike_phishing_url_is_high_risk():
    result = analyze_url("http://paypa1-secure-login.com/verify")
    assert result.risk == "High Risk"
    assert result.score >= 3


def test_url_without_scheme_is_normalised():
    result = analyze_url("example.com")
    assert result.scan_type == "url"
    assert result.risk == "Low Risk"


@pytest.mark.parametrize("bad", ["", "   ", "not a url", "https://", "ftp://example.com"])
def test_invalid_urls_raise(bad):
    with pytest.raises(ValueError):
        analyze_url(bad)


def test_domain_analysis_returns_domain_type():
    result = analyze_domain("suspicious-login-example.com")
    assert result.scan_type == "domain"
    assert result.risk in {"Caution", "High Risk"}


def test_clean_domain_is_low_risk():
    result = analyze_domain("example.com")
    assert result.risk == "Low Risk"
