from contextlib import asynccontextmanager
from typing import Any, Callable, Coroutine

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1 import calls as calls_router
from src.api.v1 import tags as tags_router
from src.api.v1 import tasks as tasks_router
from src.api.v1 import template_tasks as template_tasks_router
from src.core.db import init_db
from src.constants.api import API_PREFIX, ALLOWED_ORIGINS
from src.utils.logger import logger
from src.utils.rate_limit import rate_limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Starting Centriq API...')
    init_db()
    logger.info('Database initialized successfully')
    logger.info('Centriq API started successfully')
    yield
    logger.info('Shutting down Centriq API...')


app = FastAPI(title='Centriq API', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.middleware('http')
async def rate_limit_middleware(
    request: Request,
    call_next: Callable[[Request], Coroutine[Any, Any, Response]],
) -> Response:
    await rate_limiter(request)
    response = await call_next(request)
    return response


app.include_router(tags_router.router, prefix=API_PREFIX, tags=['tags'])
app.include_router(tasks_router.router, prefix=API_PREFIX, tags=['tasks'])
app.include_router(template_tasks_router.router, prefix=API_PREFIX, tags=['template-tasks'])
app.include_router(calls_router.router, prefix=API_PREFIX, tags=['calls'])
