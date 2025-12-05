from src.core.exceptions import InvalidDaysLimitError
from src.constants.limits import MIN_DAYS_LIMIT, MAX_DAYS_LIMIT


def validate_days_limit(days: int) -> None:
    if days < MIN_DAYS_LIMIT or days > MAX_DAYS_LIMIT:
        raise InvalidDaysLimitError(f'Days parameter must be between 1 and 30, got {days}')
