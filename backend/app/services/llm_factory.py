"""
LLM Factory service for initializing provider-agnostic Chat Model clients (Claude & OpenAI).
Configured via app.core.config.settings with lazy initialization, caching, and key validation.
"""

from enum import Enum
import logging
from typing import Dict, Optional, Tuple, Type
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMProvider(str, Enum):
    """Supported LLM Providers."""
    CLAUDE = "claude"
    OPENAI = "openai"


# Cache key tuple structure: (provider_name, model_name, temperature, streaming)
CacheKey = Tuple[str, str, float, bool]


class LLMFactory:
    """
    Singleton LLM Factory supporting dynamic lazy instantiation of Anthropic and OpenAI chat models.
    """

    _instance: Optional["LLMFactory"] = None
    _client_cache: Dict[CacheKey, BaseChatModel] = {}

    def __new__(cls) -> "LLMFactory":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._client_cache = {}
        return cls._instance

    @staticmethod
    def _validate_temperature(temperature: float) -> None:
        """
        Validates that temperature is within the supported range [0.0, 2.0].
        """
        if not (0.0 <= temperature <= 2.0):
            raise ValueError(
                f"Invalid temperature {temperature}. Temperature must be between 0.0 and 2.0."
            )

    def _get_or_create_client(
        self,
        provider: LLMProvider,
        model_name: str,
        temperature: float,
        streaming: bool,
        api_key: Optional[str],
        client_cls: Type[BaseChatModel],
    ) -> BaseChatModel:
        """
        Generic private helper for API key validation, cache lookup, and lazy client creation.
        """
        self._validate_temperature(temperature)

        if not api_key:
            logger.error(f"Attempted to initialize {provider.value} model without an API key configured.")
            raise ValueError(
                f"{provider.value.upper()}_API_KEY is not configured in environment variables or .env file."
            )

        cache_key: CacheKey = (provider.value, model_name, temperature, streaming)

        if cache_key not in self._client_cache:
            logger.info(
                f"Initializing new {provider.value.title()} chat client: "
                f"model='{model_name}', temp={temperature}, streaming={streaming}"
            )
            self._client_cache[cache_key] = client_cls(
                model=model_name,
                api_key=api_key,
                temperature=temperature,
                streaming=streaming,
            )

        return self._client_cache[cache_key]

    def get_anthropic(
        self,
        model_name: Optional[str] = None,
        temperature: float = 0.0,
        streaming: bool = False,
    ) -> ChatAnthropic:
        """
        Lazily initializes and returns an Anthropic ChatAnthropic model instance.
        """
        selected_model = model_name or settings.CLAUDE_MODEL_NAME
        api_key = settings.anthropic_api_key_str

        return self._get_or_create_client(
            provider=LLMProvider.CLAUDE,
            model_name=selected_model,
            temperature=temperature,
            streaming=streaming,
            api_key=api_key,
            client_cls=ChatAnthropic,
        )  # type: ignore[return-value]

    def get_openai(
        self,
        model_name: Optional[str] = None,
        temperature: float = 0.0,
        streaming: bool = False,
    ) -> ChatOpenAI:
        """
        Lazily initializes and returns an OpenAI ChatOpenAI model instance.
        """
        selected_model = model_name or settings.OPENAI_MODEL_NAME
        api_key = settings.openai_api_key_str

        return self._get_or_create_client(
            provider=LLMProvider.OPENAI,
            model_name=selected_model,
            temperature=temperature,
            streaming=streaming,
            api_key=api_key,
            client_cls=ChatOpenAI,
        )  # type: ignore[return-value]

    def get_default_llm(
        self,
        temperature: float = 0.0,
        streaming: bool = False,
    ) -> BaseChatModel:
        """
        Returns the primary LLM model based on settings.DEFAULT_LLM_PROVIDER ('claude' or 'openai').
        """
        provider_str = settings.DEFAULT_LLM_PROVIDER.lower()
        if provider_str == LLMProvider.CLAUDE.value:
            return self.get_anthropic(temperature=temperature, streaming=streaming)
        elif provider_str == LLMProvider.OPENAI.value:
            return self.get_openai(temperature=temperature, streaming=streaming)
        else:
            logger.error(f"Unsupported LLM provider configured: {provider_str}")
            raise ValueError(
                f"Unsupported DEFAULT_LLM_PROVIDER '{provider_str}'. Expected 'claude' or 'openai'."
            )


# Singleton instance export
llm_factory = LLMFactory()


def get_llm_factory() -> LLMFactory:
    """
    Returns the singleton LLMFactory instance for FastAPI dependency injection.
    """
    return llm_factory
