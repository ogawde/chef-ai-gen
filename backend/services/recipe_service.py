import httpx  
import json
import os
from typing import Dict, Any
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
        }
    
    def _build_prompt(self, request: RecipeRequest) -> str:
        ingredients_list = ", ".join(request.ingredients)
        prompt = f"""You are a professional chef assistant. Create a delicious, practical recipe using ONLY the following ingredients: {ingredients_list}.

User Preferences:
- Dietary Restriction: {request.dietary_restriction}
- Cuisine Style: {request.cuisine_type}
- Cooking Time: {request.cooking_time}

Important Guidelines:
1. You may assume the user has basic staples (salt, pepper, cooking oil, water)
2. Create a recipe that's practical and easy to follow
3. Give the recipe an appealing, descriptive name
4. Provide clear, step-by-step instructions

Return ONLY a valid JSON object with this exact structure (no additional text):
{{
    "title": "Recipe Name Here",
    "ingredients": ["ingredient 1 with measurement", "ingredient 2 with measurement"],
    "instructions": ["step 1", "step 2", "step 3"],
    "prep_time": "estimated time in minutes",
    "servings": "number of servings"
}}"""
        
        return prompt
    
    async def generate_recipe(self, request: RecipeRequest) -> Recipe:
        prompt = self._build_prompt(request)
        
        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
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
            ai_content = response_data['choices'][0]['message']['content']
        except (KeyError, IndexError) as e:
            raise ValueError(f"Unexpected API response structure: {str(e)}")
        
        ai_content = ai_content.strip()
        
        if ai_content.startswith("```json"):
            ai_content = ai_content[7:]
        if ai_content.startswith("```"):
            ai_content = ai_content[3:]
        if ai_content.endswith("```"):
            ai_content = ai_content[:-3]
        
        ai_content = ai_content.strip()
        
        try:
            recipe_dict = json.loads(ai_content)
        except json.JSONDecodeError as e:
            raise ValueError(f"AI did not return valid JSON: {str(e)}\nContent: {ai_content}")
        
        try:
            recipe = Recipe(**recipe_dict)
        except Exception as e:
            raise ValueError(f"Invalid recipe structure: {str(e)}")
        
        return recipe


recipe_service = RecipeService()

