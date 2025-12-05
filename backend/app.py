from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1 import calls as calls_router
from src.api.v1 import tags as tags_router
from src.api.v1 import tasks as tasks_router
from src.api.v1 import template_tasks as template_tasks_router
from src.core.db import init_db
from src.constants.api import API_PREFIX, ALLOWED_ORIGINS

app: FastAPI = FastAPI(title='Cytactic API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
def on_startup() -> None:
    init_db()


app.include_router(tags_router.router, prefix=API_PREFIX, tags=['tags'])
app.include_router(tasks_router.router, prefix=API_PREFIX, tags=['tasks'])
app.include_router(template_tasks_router.router, prefix=API_PREFIX, tags=['template-tasks'])
app.include_router(calls_router.router, prefix=API_PREFIX, tags=['calls'])
