"""Convenience entrypoint for running the FastAPI app.

This allows running:

  python -m uvicorn main:app --reload

from the repo root.
"""

from app.main import app
