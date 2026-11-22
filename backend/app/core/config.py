"""Application configuration via pydantic-settings."""
import json
from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Security
    secret_key: str = "CHANGE_ME_IN_PRODUCTION_EDUCAL_KEY_2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours for production session stability

    # Database
    database_url: str = "sqlite+aiosqlite:///./educal.db"

    # CORS
    cors_origins: Union[List[str], str] = ["*"]

    @field_validator("cors_origins", mode="after")
    @classmethod
    def assemble_cors(cls, v):
        if isinstance(v, str):
            v_clean = v.strip()
            if v_clean.startswith("[") and v_clean.endswith("]"):
                return json.loads(v_clean)
            return [origin.strip() for origin in v_clean.split(",") if origin.strip()]
        return v

    @field_validator("database_url", mode="before")
    @classmethod
    def assemble_db_connection(cls, v):
        if isinstance(v, str):
            # Render and Supabase often provide postgres:// or postgresql://
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            if v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
            if v.startswith("sqlite:///") and not v.startswith("sqlite+aiosqlite:"):
                return v.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
        return v


settings = Settings()
