"use client";



import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChefHat, Sparkles } from "lucide-react";
import { generateRecipe, ApiError } from "@/lib/api";
import { Recipe, DIETARY_RESTRICTIONS, CUISINE_TYPES, COOKING_TIMES } from "@/lib/types";
import { validateIngredients } from "@/lib/content-validation";
import { toast } from "sonner";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: Recipe) => void;
}

export function RecipeGenerator({ onRecipeGenerated }: RecipeGeneratorProps) {

  const [ingredients, setIngredients] = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("None");
  const [cuisineType, setCuisineType] = useState("Any");
  const [cookingTime, setCookingTime] = useState("No Preference");


  const [isLoading, setIsLoading] = useState(false);


  const handleGenerate = async () => {

    if (!ingredients.trim()) {
      toast.error("Please enter at least one ingredient");
      return;
    }



    const ingredientsList = ingredients
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (ingredientsList.length === 0) {
      toast.error("Please enter valid ingredients");
      return;
    }

    const validation = validateIngredients(ingredientsList);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid ingredients detected");
      return;
    }

    setIsLoading(true);

    try {

      const response = await generateRecipe({
        ingredients: ingredientsList,
        dietary_restriction: dietaryRestriction,
        cuisine_type: cuisineType,
        cooking_time: cookingTime,
      });


      toast.success("Recipe generated successfully! 🎉");
      onRecipeGenerated(response.recipe);
    } catch (error) {

      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Recipe generation error:", error);
    } finally {

      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Create Your Recipe</CardTitle>
        </div>
        <CardDescription>
          Enter your available ingredients and let AI create a delicious recipe for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {}
        <div className="space-y-2">
          <Label htmlFor="ingredients" className="text-base font-semibold">
            Your Ingredients
          </Label>
          <Textarea
            id="ingredients"
            placeholder="Enter ingredients separated by commas or new lines&#10;Example: chicken breast, tomatoes, garlic, pasta, basil"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Basic staples like salt, pepper, and oil are assumed to be available
          </p>
        </div>

        {}
        <div className="space-y-2">
          <Label htmlFor="dietary" className="text-base font-semibold">
            Dietary Restrictions
          </Label>
          <Select
            value={dietaryRestriction}
            onValueChange={setDietaryRestriction}
            disabled={isLoading}
          >
            <SelectTrigger id="dietary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIETARY_RESTRICTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {}
        <div className="space-y-2">
          <Label htmlFor="cuisine" className="text-base font-semibold">
            Cuisine Style
          </Label>
          <Select
            value={cuisineType}
            onValueChange={setCuisineType}
            disabled={isLoading}
          >
            <SelectTrigger id="cuisine">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUISINE_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {}
        <div className="space-y-2">
          <Label htmlFor="time" className="text-base font-semibold">
            Cooking Time
          </Label>
          <Select
            value={cookingTime}
            onValueChange={setCookingTime}
            disabled={isLoading}
          >
            <SelectTrigger id="time">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COOKING_TIMES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {}
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Recipe...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Recipe
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

