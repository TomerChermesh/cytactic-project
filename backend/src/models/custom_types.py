from enum import Enum

class TaskType(str, Enum):
    TEMPLATE = 'template'
    AD_HOC = 'ad_hoc'


class TaskStatus(str, Enum):
    OPEN = 'open'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
