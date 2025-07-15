from fastapi import FastAPI, HTTPException
from model import RecipeRequest, RecipeResponse, ErrorResponse, Recipe  

app = FastAPI(
    title="Recipe API",
    description="A simple FastAPI backend for recipe generation.",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Recipe API is running "}

@app.post("/recipes", response_model=RecipeResponse, responses={400: {"model": ErrorResponse}})
def generate_recipe(payload: RecipeRequest):


    if not payload.ingredients:
        raise HTTPException(status_code=400, detail="No ingredients provided")

    recipe = Recipe(
        title=f"Custom {payload.cuisine_type} Recipe",
        ingredients=payload.ingredients,
        instructions=[
            "Mix all ingredients together.",
            "Cook for 15 minutes.",
            "Serve hot and enjoy!"
        ],
        prep_time="20 minutes",
        servings="2"
    )

    return RecipeResponse(
        success=True,
        recipe=recipe,
        message="Recipe generated successfully!"
    )
