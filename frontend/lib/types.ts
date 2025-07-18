
export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];

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





export const CUISINE_TYPES = [
  { value: "Any", label: "Any Cuisine" },
  { value: "Italian", label: "Italian" },
  { value: "Mexican", label: "Mexican" },
  { value: "Indian", label: "Indian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "French", label: "French" },
] as const;


