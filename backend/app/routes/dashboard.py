"""Dashboard aggregate statistics for the signed-in user."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.scan import Scan
from app.models.user import User
from app.routes.deps import get_current_user
from app.schemes.scan import DashboardStats, ScanOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> DashboardStats:
    scans = (
        db.query(Scan)
        .filter(Scan.user_id == user.id)
        .order_by(Scan.created_at.desc())
        .all()
    )

    total = len(scans)
    high = sum(1 for scan in scans if scan.risk == "High Risk")
    caution = sum(1 for scan in scans if scan.risk == "Caution")
    low = sum(1 for scan in scans if scan.risk == "Low Risk")

    return DashboardStats(
        total=total,
        high=high,
        caution=caution,
        low=low,
        recent=[ScanOut.model_validate(scan) for scan in scans[:10]],
    )
