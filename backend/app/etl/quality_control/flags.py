"""ARGO Standard Quality Control Flags enum."""
from enum import IntEnum


class QCFlag(IntEnum):
    """ARGO International QC Flag Standards."""
    NO_QC = 0            # No QC performed
    GOOD = 1             # Good data
    PROBABLY_GOOD = 2    # Probably good data
    PROBABLY_BAD = 3     # Bad data that may be correctable
    BAD = 4              # Bad data / outlier / sensor failure
    CHANGED = 5          # Value changed
    NOT_USED = 6         # Not used
    INTERPOLATED = 8     # Interpolated value
    MISSING = 9          # Missing value
