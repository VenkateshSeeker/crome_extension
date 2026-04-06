import requests
from app.config import NVIDIA_API_KEY, MODEL_NAME, INVOKE_URL


def extract_filters(user_query):

    prompt = f"""
Extract shopping filters from the text below.

Return JSON only.

Fields:
category
brand
color
price_min
price_max
use_case
features

Text:
{user_query}
"""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 512,
        "stream": False
    }

    response = requests.post(INVOKE_URL, headers=headers, json=payload)
    res_data = response.json()
    
    if "choices" in res_data:
        import json
        content = res_data["choices"][0]["message"]["content"]
        # Clean markdown code blocks if the model adds them
        content = content.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(content)
        except Exception:
            return {"raw_text": content}
            
    return res_data
