from pydantic import BaseModel, Field  # pyright: ignore[reportMissingImports]
from typing import Optional, List


class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1)
    dietary_restriction: Optional[str] = Field(default="None")
    cuisine_type: Optional[str] = Field(default="Any")
    cooking_time: Optional[str] = Field(default="No Preference")


class Recipe(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]
    prep_time: str
    servings: str


class RecipeResponse(BaseModel):
    success: bool = Field(default=True)
    recipe: Recipe
    message: Optional[str] = Field(default=None)


class ErrorResponse(BaseModel):
    success: bool = Field(default=False)
    error: str
    detail: Optional[str] = Field(default=None)

