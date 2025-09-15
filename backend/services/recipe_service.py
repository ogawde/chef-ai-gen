import httpx
import json
import os
import re
from model import Recipe, RecipeRequest


class RecipeService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cooksy.curr.xyz",
            "X-Title": "cooksy AI",
        }
    
    def _build_prompt(self, request: RecipeRequest) -> str:
        ingredients_list = ", ".join(request.ingredients)
        prompt = f"""Create one practical recipe using ONLY these main ingredients: {ingredients_list}.
Allowed extra staples: salt, pepper, cooking oil, water.

Preferences:
- Dietary Restriction: {request.dietary_restriction}
- Cuisine Style: {request.cuisine_type}
- Cooking Time: {request.cooking_time}

Return only valid JSON (no markdown, no explanation) with keys:
title, ingredients, instructions, prep_time, servings.
Use concrete values, real measurements, and clear steps.
Do not output placeholders like "...", "ingredient 1", or "step 1"."""
        
        return prompt

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
    
    async def generate_recipe(self, request: RecipeRequest) -> Recipe:
        prompt = self._build_prompt(request)
        
        payload = {
            "model": "stepfun/step-3.5-flash:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
            "max_tokens": 4000,
            "reasoning": {
                "effort": "low",
            },
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
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
        
        try:
            recipe = Recipe(**recipe_dict)
        except Exception as e:
            raise ValueError(f"Invalid recipe structure: {str(e)}")
        
        return recipe


recipe_service = RecipeService()

