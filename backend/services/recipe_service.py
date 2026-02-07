import httpx
import json
import os
import re
from model import Recipe, RecipeRequest


class RecipeService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = os.getenv("OPENROUTER_MODEL", "openrouter/free")
        try:
            self.max_tokens = int(os.getenv("OPENROUTER_MAX_TOKENS", "1800"))
        except ValueError:
            self.max_tokens = 1800

        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cooksy.curr.xyz",
            "X-OpenRouter-Title": "cooksy AI",
        }
    
    def _build_prompt(self, request: RecipeRequest) -> str:
        ingredients_list = ", ".join(request.ingredients)
        diet = request.dietary_restriction or "None"
        cuisine = request.cuisine_type or "Any"
        cook_time = request.cooking_time or "No Preference"
        return f"""Pantry: {ingredients_list}
Extras allowed: salt, pepper, oil, water.
Diet: {diet} | Cuisine: {cuisine} | Time: {cook_time}

Output one JSON object only—no markdown fences, no text before or after.
Keys: title (string), ingredients (array of strings), instructions (array of strings), prep_time (string), servings (string).

Rules: Use only the pantry items above + extras. ingredients must be a string array (not an object), each item "amount + name". instructions: 4–7 short steps, one sentence each. Be brief: no intro, no tips paragraph, no placeholders."""

    def _build_fallback_recipe(self, request: RecipeRequest) -> Recipe:
        cleaned_ingredients = [item.strip() for item in request.ingredients if item.strip()]
        main_ingredients = cleaned_ingredients[:4]

        title_suffix = " & ".join(main_ingredients[:2]) if len(main_ingredients) >= 2 else "Pantry Mix"
        recipe_title = f"Simple {title_suffix.title()} Recipe"

        recipe_ingredients = [f"{item} (as needed)" for item in main_ingredients]
        if not recipe_ingredients:
            recipe_ingredients = ["mixed pantry ingredients (as needed)"]

        recipe_instructions = [
            "Prep the ingredients by washing, trimming, and cutting into bite-size pieces where needed.",
            "Heat a pan with a little cooking oil, then cook the harder ingredients first and softer ones later.",
            "Season with salt and pepper, adjust with water as needed, and cook until everything is done to your preference.",
            "Serve warm and adjust seasoning before plating.",
        ]

        return Recipe(
            title=recipe_title,
            ingredients=recipe_ingredients,
            instructions=recipe_instructions,
            prep_time="25 minutes",
            servings="2",
        )

    @staticmethod
    def _coerce_string_list(raw) -> list[str]:
        """Turn list/dict/nested shapes from the model into a flat list of strings."""
        if raw is None:
            return []
        if isinstance(raw, str):
            s = raw.strip()
            return [s] if s else []
        if isinstance(raw, list):
            out: list[str] = []
            for x in raw:
                out.extend(RecipeService._coerce_string_list(x))
            return [y for y in out if y]
        if isinstance(raw, dict):
            out = []
            for v in raw.values():
                out.extend(RecipeService._coerce_string_list(v))
            return [y for y in out if y]
        s = str(raw).strip()
        return [s] if s else []

    def _normalize_recipe_dict(self, recipe_dict: dict, request: RecipeRequest) -> dict:
        recipe_dict["ingredients"] = self._coerce_string_list(recipe_dict.get("ingredients"))
        recipe_dict["instructions"] = self._coerce_string_list(recipe_dict.get("instructions"))
        if not recipe_dict["ingredients"]:
            recipe_dict["ingredients"] = [
                f"{item.strip()} (as needed)"
                for item in request.ingredients
                if item and str(item).strip()
            ] or ["mixed pantry ingredients (as needed)"]
        if not recipe_dict["instructions"]:
            recipe_dict["instructions"] = [
                "Prepare ingredients as needed, then cook until done and season to taste.",
            ]
        return recipe_dict

    async def generate_recipe(self, request: RecipeRequest) -> Recipe:
        prompt = self._build_prompt(request)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
            "max_tokens": self.max_tokens,
        }

        async with httpx.AsyncClient(timeout=httpx.Timeout(90.0)) as client:
            try:
                response = await client.post(
                    self.api_url,
                    headers=self.headers,
                    json=payload
                )
                response.raise_for_status()
                
            except httpx.HTTPError as e:
                raise ValueError(f"API request failed: {str(e)}")
        
        response_data = response.json()
        
        try:
            message = response_data["choices"][0]["message"]
            ai_content = message.get("content")
        except (KeyError, IndexError, TypeError) as e:
            raise ValueError(f"Unexpected API response structure: {str(e)}")
        
        if not isinstance(ai_content, str) or not ai_content.strip():
            reasoning = message.get("reasoning")
            if isinstance(reasoning, str) and reasoning.strip():
                ai_content = reasoning
            else:
                raise ValueError("Model returned empty content. Please try again.")
        
        ai_content = ai_content.strip()
        
        if ai_content.startswith("```json"):
            ai_content = ai_content[7:]
        if ai_content.startswith("```"):
            ai_content = ai_content[3:]
        if ai_content.endswith("```"):
            ai_content = ai_content[:-3]
        
        ai_content = ai_content.strip()
        
        ai_content = re.sub(r':\s*\*\*"', ': "', ai_content)
        ai_content = re.sub(r'"\*\*(\s*[,}\]])', r'"\1', ai_content)
        
        try:
            recipe_dict = json.loads(ai_content)
        except json.JSONDecodeError:
            json_match = re.search(r'\{[\s\S]*\}', ai_content)
            if json_match:
                try:
                    recipe_dict = json.loads(json_match.group(0))
                except json.JSONDecodeError:
                    return self._build_fallback_recipe(request)
            else:
                return self._build_fallback_recipe(request)
        
        if "prep_time" in recipe_dict and not isinstance(recipe_dict["prep_time"], str):
            recipe_dict["prep_time"] = str(recipe_dict["prep_time"])
        if "servings" in recipe_dict and not isinstance(recipe_dict["servings"], str):
            recipe_dict["servings"] = str(recipe_dict["servings"])

        recipe_dict = self._normalize_recipe_dict(recipe_dict, request)

        try:
            recipe = Recipe(**recipe_dict)
        except Exception as e:
            raise ValueError(f"Invalid recipe structure: {str(e)}")
        
        return recipe


recipe_service = RecipeService()

