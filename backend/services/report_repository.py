"""Database service for reports"""
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.schemas import SaveReportInput, ReportListItem, SavedReport


class ReportRepository:
    """Repository for report database operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.diagnostic_reports
    
    async def save(self, data: SaveReportInput) -> bool:
        """Save or update a report"""
        doc = {
            "_id": data.reportId,
            "reportId": data.reportId,
            "intake": data.intake.model_dump(),
            "report": data.report.model_dump(),
            "createdAt": data.createdAt,
            "pdfUrl": data.pdfUrl,
        }
        
        await self.collection.replace_one(
            {"_id": data.reportId},
            doc,
            upsert=True
        )
        return True
    
    async def get_list(self) -> List[ReportListItem]:
        """Get list of all saved reports"""
        cursor = self.collection.find(
            {},
            {"_id": 1, "intake.workflowName": 1, "createdAt": 1}
        ).sort("createdAt", -1)
        
        reports = await cursor.to_list(1000)
        
        return [
            ReportListItem(
                id=str(r["_id"]),
                workflowName=r.get("intake", {}).get("workflowName", "Unknown"),
                createdAt=r.get("createdAt", ""),
            )
            for r in reports
        ]
    
    async def get_by_id(self, report_id: str) -> Optional[dict]:
        """Get a single report by ID"""
        return await self.collection.find_one({"_id": report_id})
