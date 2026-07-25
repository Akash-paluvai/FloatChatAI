"""EventPublisher & EventSubscriber abstractions."""
from app.events.bus import event_bus
from app.events.event import Event


class EventPublisher:
    @staticmethod
    async def publish_dataset_imported(dataset_id: str):
        event = Event(name="dataset_imported", payload={"dataset_id": dataset_id})
        await event_bus.publish(event)


class EventSubscriber:
    @staticmethod
    async def on_dataset_imported_handler(event: Event):
        # Placeholder handler: Index Updated -> Vector DB Updated -> Cache Cleared
        pass


# Register subscriber handlers
event_bus.subscribe("dataset_imported", EventSubscriber.on_dataset_imported_handler)
