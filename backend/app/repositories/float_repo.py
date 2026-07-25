"""Float, Profile, Visualization & Export Repository abstractions."""
from typing import List, Optional
from datetime import datetime, timezone
from app.repositories.base import BaseRepository
from app.domain.entities.float_entity import Float
from app.domain.entities.profile import OceanProfile
from app.domain.entities.measurement import Measurement
from app.domain.entities.visualization import Visualization
from app.domain.value_objects.coordinates import Coordinates


class FloatRepository(BaseRepository[Float]):
    async def get_by_id(self, id: str) -> Optional[Float]:
        return Float(
            wmo_id=int(id),
            coordinates=Coordinates(latitude=15.5, longitude=88.2),
            ocean_region="Bay of Bengal",
            status="active",
            last_telemetry=datetime.now(timezone.utc),
        )

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Float]:
        return [
            Float(wmo_id=2901234, coordinates=Coordinates(15.5, 88.2), ocean_region="Bay of Bengal", status="active", last_telemetry=datetime.now(timezone.utc)),
            Float(wmo_id=2901235, coordinates=Coordinates(12.1, 68.4), ocean_region="Arabian Sea", status="active", last_telemetry=datetime.now(timezone.utc)),
            Float(wmo_id=2901236, coordinates=Coordinates(-18.4, 75.3), ocean_region="Southern Ocean", status="active", last_telemetry=datetime.now(timezone.utc)),
        ]

    async def create(self, entity: Float) -> Float:
        raise NotImplementedError("Float repository creation will be connected in Phase 4.")


class ProfileRepository(BaseRepository[OceanProfile]):
    async def get_by_id(self, id: str) -> Optional[OceanProfile]:
        return OceanProfile(
            profile_id=id,
            wmo_id=2901234,
            coordinates=Coordinates(15.5, 88.2),
            timestamp=datetime.now(timezone.utc),
            ocean_region="Bay of Bengal",
            measurements=[
                Measurement(depth_m=0.0, temperature_celsius=28.5, salinity_psu=33.2),
                Measurement(depth_m=100.0, temperature_celsius=24.1, salinity_psu=34.5),
                Measurement(depth_m=500.0, temperature_celsius=10.4, salinity_psu=35.0),
                Measurement(depth_m=2000.0, temperature_celsius=2.1, salinity_psu=34.7),
            ],
        )

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[OceanProfile]:
        p = await self.get_by_id("prof-101")
        return [p] if p else []

    async def create(self, entity: OceanProfile) -> OceanProfile:
        raise NotImplementedError("Profile repository creation will be connected in Phase 4.")


class VisualizationRepository(BaseRepository[Visualization]):
    async def get_by_id(self, id: str) -> Optional[Visualization]:
        return Visualization(
            id=id,
            title="Bay of Bengal Depth Profile",
            viz_type="temperature_profile",
            ocean_region="Bay of Bengal",
            plotly_config={"type": "scatter", "mode": "lines+markers"},
        )

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Visualization]:
        v = await self.get_by_id("viz-101")
        return [v] if v else []

    async def create(self, entity: Visualization) -> Visualization:
        raise NotImplementedError("Visualization repository creation will be connected in Phase 5.")


class ExportRepository:
    async def generate_export(self, ocean_region: str, export_format: str) -> dict:
        return {
            "export_id": "exp-101",
            "file_name": f"floatchat_{ocean_region.lower().replace(' ', '_')}.{export_format.lower()}",
            "file_size": "3.1 MB",
            "download_url": f"/api/v1/exports/download/exp-101.{export_format.lower()}",
            "status": "Completed",
        }
