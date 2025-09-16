"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RecipeDisplay } from "@/components/recipe-display";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Recipe } from "@/lib/types";

const STORAGE_KEY = "cooksy:last-recipe";

export default function RecipePage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setRecipe(null);
      setHasLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Recipe;
      setRecipe(parsed);
    } catch {
      setRecipe(null);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  const handleNewPrompt = () => {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-3xl space-y-6">
          <div className="space-y-2 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Cooksy
            </motion.h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Your generated recipe is ready.
            </p>
          </div>

          {!hasLoaded ? (
            <div className="h-64 w-full animate-pulse rounded-2xl border bg-card/50" />
          ) : recipe ? (
            <RecipeDisplay recipe={recipe} onGenerateAnother={handleNewPrompt} />
          ) : (
            <div className="rounded-2xl border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No recipe found. Generate one from the landing page.
              </p>
              <div className="mt-4 flex justify-center">
                <Button onClick={() => router.push("/")}>Go to Cooksy</Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

