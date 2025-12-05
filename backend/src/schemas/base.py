from pydantic import BaseModel
from datetime import datetime

class BaseReadSchema(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime
