const BLOCKED_TERMS = [
  'human head', 'human', 'head', 'brain', 'heart', 'liver', 'kidney', 'organ',
  'body part', 'limb', 'flesh', 'corpse', 'cadaver',
  'poison', 'toxic', 'chemical', 'bleach', 'detergent', 'soap', 'paint',
  'gasoline', 'fuel', 'alcohol', 'drug', 'medicine', 'pill', 'tablet',
  'plastic', 'metal', 'glass', 'wood', 'stone', 'rock', 'dirt', 'soil',
  'paper', 'fabric', 'cloth', 'rubber', 'leather',
  'cannabis', 'marijuana', 'cocaine', 'heroin', 'meth', 'lsd',
  'feces', 'urine', 'blood', 'vomit', 'excrement',
  'knife', 'weapon', 'gun', 'bullet', 'explosive',
  'dog', 'cat', 'hamster', 'rabbit', 'bird', 'parrot', 'canary',
  'dolphin', 'whale', 'seal', 'penguin', 'elephant', 'tiger', 'lion',
  'insect', 'bug', 'worm', 'spider', 'roach', 'rat', 'mouse',
];

export function validateIngredients(ingredients: string[]): {
  isValid: boolean;
  error?: string;
} {
  if (!ingredients || ingredients.length === 0) {
    return { isValid: false, error: 'At least one ingredient is required' };
  }

  const normalizedIngredients = ingredients
    .map(ing => ing.toLowerCase().trim())
    .join(' ');

  for (const term of BLOCKED_TERMS) {
    if (normalizedIngredients.includes(term.toLowerCase())) {
      return {
        isValid: false,
        error: `Invalid ingredient detected. Please use only food ingredients.`,
      };
    }
  }

  return { isValid: true };
}
