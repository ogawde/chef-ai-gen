"use client";

import { useRouter } from "next/navigation";
import { RecipeGenerator } from "@/components/recipe-generator";
import { Recipe } from "@/lib/types";
import { PageGridBackground } from "@/components/page-grid-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "motion/react";
import BreathingText from "@/components/fancy/text/breathing-text";

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
    <div className="relative min-h-screen w-full bg-background">
      <PageGridBackground />
      <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 sm:right-4 sm:top-4">
        <ThemeToggle />
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-3xl space-y-8">
          <motion.div
            variants={headerContainer}
            initial="hidden"
            animate="show"
            className="space-y-2 text-center"
          >
            <motion.div variants={headerItem}>
              <BreathingText
                as="h1"
                className="font-overused-grotesk text-3xl tracking-tight sm:text-4xl"
                staggerDuration={0.08}
                fromFontVariationSettings="'wght' 100, 'slnt' 0"
                toFontVariationSettings="'wght' 800, 'slnt' -10"
              >
                Lets start cooking with Cooksy!
              </BreathingText>
            </motion.div>
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
