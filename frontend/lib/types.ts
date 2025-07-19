export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prep_time: string;
  servings: string;
}

export interface RecipeRequest {
  ingredients: string[];
  dietary_restriction?: string;
  cuisine_type?: string;
  cooking_time?: string;
}

export interface RecipeResponse {
  success: boolean;
  recipe: Recipe;
  message?: string;
}

export interface ErrorResponse {
  detail: string;
}

export const DIETARY_RESTRICTIONS = [
  { value: "None", label: "No Restrictions" },
  { value: "Vegan", label: "Vegan" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Gluten-Free", label: "Gluten-Free" },
  { value: "Keto", label: "Keto" },
  { value: "Paleo", label: "Paleo" },
] as const;

export const CUISINE_TYPES = [
  { value: "Any", label: "Any Cuisine" },
  { value: "Italian", label: "Italian" },
  { value: "Mexican", label: "Mexican" },
  { value: "Thai", label: "Thai" },
  { value: "Indian", label: "Indian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "American", label: "American" },
  { value: "French", label: "French" },
] as const;

export const COOKING_TIMES = [
  { value: "No Preference", label: "No Preference" },
  { value: "Quick 20min", label: "Quick (20 min)" },
  { value: "30-45min", label: "Medium (30-45 min)" },
  { value: "1+ hour", label: "Long (1+ hour)" },
] as const;

