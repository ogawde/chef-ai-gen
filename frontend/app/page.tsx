"use client";

import { useState } from "react";
import { RecipeGenerator } from "@/components/recipe-generator";
import { RecipeDisplay } from "@/components/recipe-display";
import { Recipe } from "@/lib/types";
import { ChefHat, Sparkles, Leaf } from "lucide-react";

export default function Home() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  const handleRecipeGenerated = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleGenerateAnother = () => {
    setCurrentRecipe(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              PantryChef AI
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {!currentRecipe && (
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your Intelligent Culinary Partner
              </h2>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your pantry ingredients into delicious recipes with AI.
              Fight food waste and discover new dishes tailored to your dietary needs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <ChefHat className="h-4 w-4" />
                AI-Powered Recipes
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 text-sm font-medium">
                <Leaf className="h-4 w-4" />
                Reduce Food Waste
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-500 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Personalized Suggestions
              </div>
            </div>
          </div>
        )}

        {!currentRecipe && (
          <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
        )}

        {currentRecipe && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RecipeDisplay
              recipe={currentRecipe}
              onGenerateAnother={handleGenerateAnother}
            />
          </div>
        )}
      </main>

      <footer className="border-t mt-16 py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using Next.js, FastAPI, and OpenRouter AI
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 PantryChef AI. Helping you cook smarter, not harder.
          </p>
        </div>
      </footer>
    </div>
  );
}
