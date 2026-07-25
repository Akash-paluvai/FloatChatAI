"""AuditService for database audit history logging."""
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.audit import LoadHistory, QueryHistory, ExportHistory


class AuditService:
    """Records database operation audit trails."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_load(self, dataset_name: str, source_file: str, records: int, duration_ms: float) -> str:
        record_id = f"load_{uuid.uuid4().hex[:8]}"
        audit = LoadHistory(
            id=record_id,
            dataset_name=dataset_name,
            source_file=source_file,
            records_loaded=records,
            duration_ms=duration_ms,
            status="COMPLETED"
        )
        self.session.add(audit)
        await self.session.commit()
        return record_id

    async def log_query(self, query_type: str, params: Optional[Dict[str, Any]], execution_ms: float, rows: int) -> str:
        record_id = f"qry_{uuid.uuid4().hex[:8]}"
        audit = QueryHistory(
            id=record_id,
            query_type=query_type,
            query_params=params,
            execution_time_ms=execution_ms,
            rows_returned=rows
        )
        self.session.add(audit)
        await self.session.commit()
        return record_id
