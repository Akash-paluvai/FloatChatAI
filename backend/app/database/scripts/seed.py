"""Database Seed Script creating initial scientific catalogs, ocean regions, datasets, floats, and profiles."""
import asyncio
from datetime import datetime, timezone
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import AsyncSessionLocal
from app.database.models.unit import UnitModel
from app.database.models.variable import VariableModel
from app.database.models.provider import ProviderModel
from app.database.models.region import OceanRegionModel
from app.database.models.dataset import DatasetModel
from app.database.models.float_model import FloatModel
from app.database.models.profile import ProfileModel


async def seed_database():
    logger.info("Seeding FloatChat Scientific Database Catalogs...")

    async with AsyncSessionLocal() as session:
        try:
            # 1. Units
            session.add(UnitModel(id="unit-celsius", name="Celsius", symbol="°C", si_unit="K", conversion_factor=1.0))
            session.add(UnitModel(id="unit-psu", name="Practical Salinity Unit", symbol="PSU", si_unit="PSU", conversion_factor=1.0))
            session.add(UnitModel(id="unit-meters", name="Meters", symbol="m", si_unit="m", conversion_factor=1.0))

            # 2. Variables
            session.add(VariableModel(id="var-temp", code="TEMP", name="Temperature", description="Sea water temperature", standard_name="sea_water_temperature"))
            session.add(VariableModel(id="var-psal", code="PSAL", name="Salinity", description="Sea water practical salinity", standard_name="sea_water_salinity"))
            session.add(VariableModel(id="var-pres", code="PRES", name="Pressure", description="Sea water pressure", standard_name="sea_water_pressure"))

            # 3. Providers
            session.add(ProviderModel(id="prov-argo", code="ARGO", name="ARGO GDAC", url="ftp://usgodae.org/pub/outgoing/argo"))
            session.add(ProviderModel(id="prov-erddap", code="ERDDAP", name="NOAA ERDDAP", url="https://coastwatch.pfeg.noaa.gov/erddap"))

            # 4. Ocean Regions
            session.add(OceanRegionModel(
                id="reg-bob", code="bob", name="Bay of Bengal", eez="India EEZ", country="India", ocean="Indian Ocean", sub_ocean="Bay of Bengal", climate_zone="Tropical"
            ))

            # 5. Datasets & Floats
            session.add(DatasetModel(id="ds-101", name="ARGO Bay of Bengal 2024 Filtered", source="ARGO GDAC", year=2024, record_count=482000, file_size_bytes=3328599654))
            session.add(FloatModel(wmo_id=2901234, dataset_id="ds-101", ocean_region_id="reg-bob", status="active", ocean_region="Bay of Bengal"))

            # 6. Sample Profile
            session.add(ProfileModel(
                profile_id="prof-101",
                float_wmo_id=2901234,
                cycle_number=42,
                timestamp=datetime.now(timezone.utc),
                latitude=15.5,
                longitude=88.2,
                location="SRID=4326;POINT(88.2 15.5)",
                max_depth_m=2000.0
            ))

            await session.commit()
            logger.info("Database Seeding Completed Successfully!")
        except Exception as e:
            await session.rollback()
            logger.warning(f"Seed script notice (catalogs already seeded or uninitialized DB): {e}")


if __name__ == "__main__":
    asyncio.run(seed_database())
