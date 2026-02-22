"""Abstraction multi-provider LLM pour SciBase.

Supporte Ollama (local), DeepSeek (API), Claude (API) et Groq (API).
"""

import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

import requests


@dataclass
class LLMResponse:
    """Réponse standardisée d'un provider LLM."""
    content: str
    model: str
    provider: str


class BaseLLMProvider(ABC):
    """Interface commune pour tous les providers LLM."""

    @abstractmethod
    def generate(self, prompt: str, system: str = "") -> LLMResponse:
        """Génère une réponse à partir d'un prompt."""

    @abstractmethod
    def check_availability(self) -> bool:
        """Vérifie que le provider est disponible."""


class OllamaProvider(BaseLLMProvider):
    """Provider pour Ollama (LLM local)."""

    def __init__(self, model: str = "deepseek-r1", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url.rstrip("/")

    def generate(self, prompt: str, system: str = "") -> LLMResponse:
        url = f"{self.base_url}/api/chat"
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        resp = requests.post(url, json={
            "model": self.model,
            "messages": messages,
            "stream": False,
        }, timeout=1800)
        resp.raise_for_status()
        data = resp.json()
        return LLMResponse(
            content=data["message"]["content"],
            model=self.model,
            provider="ollama",
        )

    def check_availability(self) -> bool:
        try:
            resp = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return resp.status_code == 200
        except requests.ConnectionError:
            return False


class DeepSeekProvider(BaseLLMProvider):
    """Provider pour l'API DeepSeek (compatible OpenAI)."""

    def __init__(self, model: str = "deepseek-chat", api_key: Optional[str] = None):
        self.model = model
        self.api_key = api_key or os.environ.get("DEEPSEEK_API_KEY")
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY requis (variable d'env ou paramètre)")

    def generate(self, prompt: str, system: str = "") -> LLMResponse:
        from openai import OpenAI

        client = OpenAI(api_key=self.api_key, base_url="https://api.deepseek.com")
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model,
            messages=messages,
        )
        return LLMResponse(
            content=response.choices[0].message.content,
            model=self.model,
            provider="deepseek",
        )

    def check_availability(self) -> bool:
        return bool(self.api_key)


class ClaudeProvider(BaseLLMProvider):
    """Provider pour l'API Anthropic Claude."""

    def __init__(self, model: str = "claude-sonnet-4-5-20250929", api_key: Optional[str] = None):
        self.model = model
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY requis (variable d'env ou paramètre)")

    def generate(self, prompt: str, system: str = "") -> LLMResponse:
        import anthropic

        client = anthropic.Anthropic(api_key=self.api_key)
        kwargs = {"model": self.model, "max_tokens": 4096, "messages": [{"role": "user", "content": prompt}]}
        if system:
            kwargs["system"] = system

        response = client.messages.create(**kwargs)
        return LLMResponse(
            content=response.content[0].text,
            model=self.model,
            provider="claude",
        )

    def check_availability(self) -> bool:
        return bool(self.api_key)


class GroqProvider(BaseLLMProvider):
    """Provider pour l'API Groq (compatible OpenAI)."""

    def __init__(self, model: str = "llama-3.3-70b-versatile", api_key: Optional[str] = None):
        self.model = model
        self.api_key = api_key or os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY requis (variable d'env ou paramètre)")

    def generate(self, prompt: str, system: str = "") -> LLMResponse:
        import re
        import time

        from openai import OpenAI, RateLimitError

        client = OpenAI(api_key=self.api_key, base_url="https://api.groq.com/openai/v1")
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        max_retries = 5
        for attempt in range(max_retries):
            try:
                response = client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                )
                return LLMResponse(
                    content=response.choices[0].message.content,
                    model=self.model,
                    provider="groq",
                )
            except RateLimitError as e:
                if attempt == max_retries - 1:
                    raise
                msg = str(e)
                match = re.search(r"try again in (\d+(?:\.\d+)?)s", msg)
                wait = float(match.group(1)) + 1 if match else 30
                # Handle "Xm Ys" format
                match_min = re.search(r"try again in (\d+)m([\d.]+)s", msg)
                if match_min:
                    wait = int(match_min.group(1)) * 60 + float(match_min.group(2)) + 1
                print(f"  [rate-limit] Attente de {wait:.0f}s (tentative {attempt + 1}/{max_retries})...")
                time.sleep(wait)

    def check_availability(self) -> bool:
        return bool(self.api_key)


PROVIDERS = {
    "ollama": OllamaProvider,
    "deepseek": DeepSeekProvider,
    "claude": ClaudeProvider,
    "groq": GroqProvider,
}


def get_provider(name: str = "ollama", **kwargs) -> BaseLLMProvider:
    """Factory function pour obtenir un provider LLM.

    Args:
        name: Nom du provider (ollama, deepseek, claude, groq)
        **kwargs: Arguments passés au constructeur du provider

    Returns:
        Instance du provider demandé
    """
    if name not in PROVIDERS:
        raise ValueError(f"Provider inconnu : {name}. Choix : {', '.join(PROVIDERS)}")
    return PROVIDERS[name](**kwargs)
