"""Event base dataclass."""
from dataclasses import dataclass, field
from datetime import datetime, timezone
import uuid


@dataclass
class Event:
    name: str
    payload: dict
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
