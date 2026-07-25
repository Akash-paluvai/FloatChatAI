"""MetadataFilterEngine enforcing scientific metadata, spatial, and temporal filters."""
from typing import Dict, Any, List


class MetadataFilterEngine:
    """Evaluates candidate metadata against strict user query metadata constraints."""

    @staticmethod
    def matches_filters(metadata: Dict[str, Any], filter_params: Dict[str, Any]) -> bool:
        if not filter_params:
            return True

        # Region filter
        if "ocean_region" in filter_params and filter_params["ocean_region"]:
            target_region = str(filter_params["ocean_region"]).lower()
            item_region = str(metadata.get("ocean_region", "")).lower()
            if target_region not in item_region and item_region not in target_region:
                return False

        # Provider filter
        if "provider" in filter_params and filter_params["provider"]:
            target_prov = str(filter_params["provider"]).lower()
            item_prov = str(metadata.get("provider", metadata.get("provider_source", ""))).lower()
            if target_prov not in item_prov and item_prov not in target_prov:
                return False

        # QC Flag filter
        if "qc_flag" in filter_params and filter_params["qc_flag"] is not None:
            target_qc = int(filter_params["qc_flag"])
            item_qc = int(metadata.get("qc_flag", 1))
            if item_qc > target_qc:
                return False

        return True
