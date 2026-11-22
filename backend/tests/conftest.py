"""Pytest configuration and async test fixtures."""
import asyncio
import os
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.core.security import create_access_token
from app.database.base import Base
from app.database.init_db import init_db
from app.database.session import async_session_factory, engine
from app.main import app
from app.models.user import User


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    await init_db()
    yield


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient):
    # Use seeded student user
    res = await client.post(
        "/api/v1/auth/token",
        data={"username": "student@educal.edu", "password": "Educal2026!"},
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
