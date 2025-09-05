import { RecipeRequest, RecipeResponse, ErrorResponse } from "./types";

const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function generateRecipe(
  request: RecipeRequest
): Promise<RecipeResponse> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/api/generate-recipe`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(
        errorData.detail || "Failed to generate recipe",
        response.status
      );
    }

    return data as RecipeResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Unable to connect to the server. Please check if the backend is running."
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

export async function healthCheck(): Promise<boolean> {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: "GET",
    });

    return response.ok;
  } catch {
    return false;
  }
}

