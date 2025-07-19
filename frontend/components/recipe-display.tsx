"use client";

/**
 * Recipe Display Component
 * 
 * Displays the generated recipe in a beautiful, user-friendly format.
 * Shows title, ingredients (with checkboxes), instructions, and metadata.
 * 
 * Data Flow:
 * Recipe from API -> This component -> Rendered UI
 */

import { Recipe } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, RefreshCw } from "lucide-react";

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnother: () => void;
}

export function RecipeDisplay({ recipe, onGenerateAnother }: RecipeDisplayProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="space-y-3 pb-6">
        {/* Recipe Title */}
        <div className="flex items-start gap-3">
          <ChefHat className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {recipe.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              AI-generated recipe tailored to your ingredients
            </CardDescription>
          </div>
        </div>

        {/* Recipe Metadata */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{recipe.prep_time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{recipe.servings}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ingredients Section */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">
              Ingredients
            </span>
          </h3>
          <ul className="space-y-2 ml-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <input
                  type="checkbox"
                  id={`ingredient-${index}`}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className="text-base leading-relaxed cursor-pointer group-hover:text-primary transition-colors"
                >
                  {ingredient}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-6" />

        {/* Instructions Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">
              Instructions
            </span>
          </h3>
          <ol className="space-y-4 ml-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed pt-1">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onGenerateAnother}
            variant="default"
            size="lg"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Another Recipe
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Print Recipe
          </Button>
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground italic">
            💡 <strong>Tip:</strong> Use the checkboxes next to ingredients as you prepare them to keep track of your progress!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

