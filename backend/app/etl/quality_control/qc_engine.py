"""QCEngine & QCReportGenerator implementation."""
from typing import Any, Dict, List
from app.etl.quality_control.flags import QCFlag
from app.etl.validators.range_validator import RangeValidator, CoordinateValidator


class QCEngine:
    """Quality Control Engine evaluating measurements and assigning ARGO QC Flags."""

    def evaluate_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        lat = data.get("latitude", 0.0)
        lon = data.get("longitude", 0.0)

        # Coordinate QC Check
        coord_valid = CoordinateValidator.validate_coordinates(lat, lon)

        variables = data.get("variables", {})
        depths = variables.get("depth_m", [])
        temps = variables.get("temp_c", [])
        salinities = variables.get("salinity_psu", [])

        qc_flags = []
        clean_temps = []
        clean_salinities = []
        failures_count = 0

        for d, t, s in zip(depths, temps, salinities):
            if not coord_valid or not RangeValidator.validate_temperature(t) or not RangeValidator.validate_salinity(s):
                qc_flags.append(int(QCFlag.BAD))
                failures_count += 1
                clean_temps.append(t if RangeValidator.validate_temperature(t) else None)
                clean_salinities.append(s if RangeValidator.validate_salinity(s) else None)
            else:
                qc_flags.append(int(QCFlag.GOOD))
                clean_temps.append(t)
                clean_salinities.append(s)

        data["variables"]["qc_flags"] = qc_flags
        data["qc_failures_count"] = failures_count
        data["qc_passed"] = failures_count == 0
        return data


class QCReportGenerator:
    """Generates QC Audit Reports for scientific observations."""

    @staticmethod
    def generate_report(data: Dict[str, Any]) -> Dict[str, Any]:
        qc_flags = data.get("variables", {}).get("qc_flags", [])
        total = len(qc_flags)
        passed = sum(1 for q in qc_flags if q in (QCFlag.GOOD, QCFlag.PROBABLY_GOOD))
        failed = total - passed

        return {
            "platform_id": data.get("platform_id", "unknown"),
            "total_measurements": total,
            "passed_measurements": passed,
            "failed_measurements": failed,
            "pass_rate_pct": round((passed / total * 100) if total > 0 else 100.0, 2),
            "qc_status": "PASSED" if failed == 0 else "WARNING_FLAGGED",
        }
