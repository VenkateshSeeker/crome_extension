import os
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

MODEL_NAME = "google/gemma-4-31b-it"

INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
