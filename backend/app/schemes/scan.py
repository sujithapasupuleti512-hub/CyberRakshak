"""Pydantic schemas for scan / analysis endpoints."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ScanRequest(BaseModel):
    target: str = Field(min_length=1, max_length=2048)


class ScanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    scan_type: str
    target: str
    risk: str
    score: int
    details: list[str]
    created_at: datetime


class AnalysisResult(BaseModel):
    target: str
    scan_type: str
    risk: str
    score: int
    details: list[str]


class DashboardStats(BaseModel):
    total: int
    high: int
    caution: int
    low: int
    recent: list[ScanOut]
