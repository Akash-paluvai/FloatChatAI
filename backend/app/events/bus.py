"""EventBus pub/sub event router."""
from typing import Callable, Dict, List
from app.events.event import Event


class EventBus:
    """Asynchronous event bus for system events (Dataset Imported -> Index Updated -> Vector DB Updated)."""
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_name: str, handler: Callable) -> None:
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        self._subscribers[event_name].append(handler)

    async def publish(self, event: Event) -> None:
        if event.name in self._subscribers:
            for handler in self._subscribers[event.name]:
                await handler(event)


event_bus = EventBus()
