from typing import Final, List

API_PREFIX: Final[str] = '/api'
ALLOWED_ORIGINS: Final[List[str]] = ['http://localhost:5173', 'https://cytactic-project.pages.dev', 'https://centriq.tomerchermesh.com/']

RATE_LIMIT_MAX_REQUESTS: Final[int] = 100
RATE_LIMIT_WINDOW_SECONDS: Final[int] = 60