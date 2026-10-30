"""Scan routes: URL/domain analysis plus per-user history."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.scan import Scan
from app.models.user import User
from app.routes.deps import get_current_user, get_optional_user
from app.schemes.scan import AnalysisResult, ScanOut, ScanRequest
from app.services.analysis import analyze_domain, analyze_url

router = APIRouter(tags=["scans"])


def _persist(db: Session, user: User | None, result: AnalysisResult) -> None:
    """Persist a scan for signed-in users only."""
    if user is None:
        return
    db.add(
        Scan(
            user_id=user.id,
            scan_type=result.scan_type,
            target=result.target,
            risk=result.risk,
            score=result.score,
            details=result.details,
        )
    )
    db.commit()


@router.post("/scan/url", response_model=AnalysisResult)
def scan_url(
    payload: ScanRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResult:
    try:
        result = analyze_url(payload.target)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    _persist(db, user, result)
    return result


@router.post("/scan/domain", response_model=AnalysisResult)
def scan_domain(
    payload: ScanRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResult:
    try:
        result = analyze_domain(payload.target)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    _persist(db, user, result)
    return result


@router.get("/scans", response_model=list[ScanOut])
def list_scans(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[Scan]:
    return (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.created_at.desc())
        .all()
    )


@router.delete("/scans", status_code=status.HTTP_204_NO_CONTENT)
def clear_scans(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> None:
    db.query(Scan).filter(Scan.user_id == user.id).delete()
    db.commit()
