"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateRecipe, ApiError } from "@/lib/api";
import {
  Recipe,
  DIETARY_RESTRICTIONS,
  CUISINE_TYPES,
  COOKING_TIMES,
} from "@/lib/types";
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
      toast.success("Recipe generated");
      onRecipeGenerated(response.recipe);
      setIngredients("");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || !ingredients.trim();

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-md"
            aria-busy="true"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-10 py-8 shadow-lg"
            >
              <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
              <p className="text-sm font-medium text-foreground">Cooking up your recipe…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isSubmitDisabled) {
            void handleGenerate();
          }
        }}
        className="w-full"
      >
        <div className="rounded-2xl border bg-card p-3 shadow-sm">
          <div className="relative">
            <Textarea
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (!isSubmitDisabled) {
                    void handleGenerate();
                  }
                }
              }}
              placeholder="Add ingredients or what to cook…"
              className="min-h-[120px] resize-none border-0 bg-transparent pr-14 pb-12 text-base shadow-none focus-visible:ring-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSubmitDisabled}
              className="absolute bottom-3 right-3 rounded-full"
              aria-label="Submit message"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
          <div className="mt-3 grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            <Select
              value={dietaryRestriction}
              onValueChange={setDietaryRestriction}
              disabled={isLoading}
            >
              <SelectTrigger className="min-w-0 w-full">
                <SelectValue placeholder="Dietary restriction" />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_RESTRICTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cuisineType} onValueChange={setCuisineType} disabled={isLoading}>
              <SelectTrigger className="min-w-0 w-full">
                <SelectValue placeholder="Cuisine style" />
              </SelectTrigger>
              <SelectContent>
                {CUISINE_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cookingTime} onValueChange={setCookingTime} disabled={isLoading}>
              <SelectTrigger className="min-w-0 w-full">
                <SelectValue placeholder="Cooking time" />
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
        </div>
      </motion.form>
    </>
  );
}
