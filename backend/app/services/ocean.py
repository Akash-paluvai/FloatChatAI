"""OceanService for oceanographic queries."""
import uuid
from app.schemas.ocean import OceanQueryRequest, OceanQueryResponse, FloatMetadata, ProfileMetadata, ProfilePoint
from app.repositories.float_repo import FloatRepository, ProfileRepository


class OceanService:
    def __init__(self):
        self.float_repo = FloatRepository()
        self.profile_repo = ProfileRepository()

    async def execute_query(self, request: OceanQueryRequest) -> OceanQueryResponse:
        floats = await self.float_repo.list_all()
        float_metas = [
          FloatMetadata(
              wmo_id=f.wmo_id,
              latitude=f.coordinates.latitude,
              longitude=f.coordinates.longitude,
              depth_m=10.0,
              temperature_c=28.4,
              salinity_psu=33.2,
              status=f.status,
              ocean_region=f.ocean_region
          ) for f in floats
        ]

        profile = await self.profile_repo.get_by_id("prof-101")
        profile_meta = ProfileMetadata(
            profile_id=profile.profile_id if profile else "prof-101",
            wmo_id=2901234,
            ocean_region=request.ocean_region or "Bay of Bengal",
            points=[
                ProfilePoint(depth_m=m.depth_m, temperature_c=m.temperature_celsius, salinity_psu=m.salinity_psu)
                for m in (profile.measurements if profile else [])
            ]
        )

        return OceanQueryResponse(
            query_id=f"qry_{uuid.uuid4().hex[:8]}",
            ocean_region=request.ocean_region or "Bay of Bengal",
            matched_records=1420,
            execution_time_ms=42.5,
            floats=float_metas,
            profile=profile_meta
        )
