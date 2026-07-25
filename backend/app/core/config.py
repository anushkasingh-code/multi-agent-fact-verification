"""
Core Settings module using Pydantic Settings.
Manages environment variables, API key configurations, and application settings.
"""

from functools import lru_cache
from typing import Literal, Optional
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings configuration loader.
    Reads values from environment variables or .env file.
    """
    # Project Identity
    PROJECT_NAME: str = "Autonomous Multi-Agent Research & Fact Verification System"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # LLM API Configuration
    OPENAI_API_KEY: Optional[SecretStr] = Field(default=None, description="OpenAI API Key")
    ANTHROPIC_API_KEY: Optional[SecretStr] = Field(default=None, description="Anthropic API Key")
    GOOGLE_API_KEY: Optional[SecretStr] = Field(default=None, description="Google Gemini API Key")
    DEFAULT_LLM_PROVIDER: Literal["claude", "openai", "gemini"] = Field(
        default="openai", description="Primary LLM provider to use for agent reasoning"
    )
    CLAUDE_MODEL_NAME: str = Field(default="claude-3-5-sonnet-20241022", description="Claude model identifier")
    OPENAI_MODEL_NAME: str = Field(default="gpt-4o", description="OpenAI model identifier")
    GEMINI_MODEL_NAME: str = Field(default="gemini-2.5-flash", description="Gemini model identifier")

    # Search Provider
    TAVILY_API_KEY: Optional[SecretStr] = Field(default=None, description="Tavily API Key for live web search")

    # Vector Embedding Model
    EMBEDDING_MODEL_NAME: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        description="SentenceTransformers local embedding model name",
    )

    # MongoDB Atlas Database Configuration
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB connection string URI",
    )
    MONGODB_DB_NAME: str = Field(default="fact_verification_db", description="Database name")
    MONGODB_COLLECTION_NAME: str = Field(
        default="research_analyses", description="Unified collection for research job documents"
    )

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def anthropic_api_key_str(self) -> Optional[str]:
        """Returns Anthropic API key as plain string if set."""
        return self.ANTHROPIC_API_KEY.get_secret_value() if self.ANTHROPIC_API_KEY else None

    @property
    def openai_api_key_str(self) -> Optional[str]:
        """Returns OpenAI API key as plain string if set."""
        return self.OPENAI_API_KEY.get_secret_value() if self.OPENAI_API_KEY else None

    @property
    def google_api_key_str(self) -> Optional[str]:
        """Returns Google API key as plain string if set."""
        return self.GOOGLE_API_KEY.get_secret_value() if self.GOOGLE_API_KEY else None

    @property
    def tavily_api_key_str(self) -> Optional[str]:
        """Returns Tavily API key as plain string if set."""
        return self.TAVILY_API_KEY.get_secret_value() if self.TAVILY_API_KEY else None


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached singleton instance of Settings.
    """
    return Settings()


# Convenient direct export of singleton settings instance
settings: Settings = get_settings()
