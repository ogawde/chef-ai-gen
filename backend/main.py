from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
from model import RecipeRequest, RecipeResponse, ErrorResponse, Recipe
from services.recipe_service import recipe_service

app = FastAPI(
    title="PantryChef AI API",
    description="AI-powered recipe generation from pantry ingredients",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "name": "PantryChef AI API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "generate_recipe": "/api/generate-recipe (POST)",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PantryChef AI"}


@app.post(
    "/api/generate-recipe",
    response_model=RecipeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "Recipe generated successfully",
            "model": RecipeResponse
        },
        400: {
            "description": "Invalid request data",
            "model": ErrorResponse
        },
        500: {
            "description": "Server error during recipe generation",
            "model": ErrorResponse
        }
    }
)
async def generate_recipe(request: RecipeRequest):
    try:
        if not request.ingredients or len(request.ingredients) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one ingredient is required"
            )
        
        recipe = await recipe_service.generate_recipe(request)
        
        return RecipeResponse(
            success=True,
            recipe=recipe,
            message="Recipe generated successfully"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the recipe: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )

