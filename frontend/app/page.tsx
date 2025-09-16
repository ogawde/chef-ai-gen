"use client";

import { useRouter } from "next/navigation";
import { RecipeGenerator } from "@/components/recipe-generator";
import { Recipe } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "motion/react";

const headerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home() {
  const router = useRouter();

  const handleRecipeGenerated = (recipe: Recipe) => {
    localStorage.setItem("cooksy:last-recipe", JSON.stringify(recipe));
    router.push("/recipe");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-3xl space-y-8">
          <motion.div
            variants={headerContainer}
            initial="hidden"
            animate="show"
            className="space-y-2 text-center"
          >
            <motion.h1
              variants={headerItem}
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Cooksy
            </motion.h1>
            <motion.span
              variants={headerItem}
              className="mx-auto block max-w-xl text-sm text-muted-foreground sm:text-base"
            >
              Add ingredients and preferences.
            </motion.span>
          </motion.div>
          <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
        </section>
      </main>
    </div>
  );
}
