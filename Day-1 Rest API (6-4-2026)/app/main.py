import logging
from logging.config import dictConfig

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth as auth_router
from app.api import protected as protected_router
from app.core.config import get_settings
from app.db.base import init_db


settings = get_settings()


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(levelname)s %(name)s %(asctime)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["default"],
    },
}


dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    # CORS - explicit dev origins to avoid misconfigured env issues
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(auth_router.router)
    app.include_router(protected_router.router)

    @app.on_event("startup")
    def on_startup() -> None:  # type: ignore[override]
        logger.info("Initializing database...")
        init_db()

    return app


app = create_app()
