"use client";
import { motion } from "motion/react";
import { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnother: () => void;
}

export function RecipeDisplay({ recipe, onGenerateAnother }: RecipeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full border bg-card shadow-sm">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl">{recipe.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {recipe.prep_time} · {recipe.servings}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Ingredients
            </h3>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm">
                  - {ingredient}
                </li>
              ))}
            </ul>
          </section>
          <Separator />
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Steps
            </h3>
            <ol className="space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-sm leading-6">
                  <span className="mr-2 font-medium">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ol>
          </section>
          <Separator />
          <div>
            <Button onClick={onGenerateAnother} variant="outline">
              <RefreshCw className="mr-2 size-4" />
              New prompt
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
