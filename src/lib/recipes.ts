interface Recipe {
  id: number;
  name: string;
  title: string;
  image: string;
  link: string;
  category: string;
  features: string[];
}

interface RecipeDetails {
  title: string;
  image: string;
  link: string;
  category?: string;
  features?: string[];
  description?: string;
  ingredients?: string[];
  equipments?: string[];
  instructions?: string[];
  notes?: string[];
  tips?: string[];
  storage?: string[];
  swaps?: string[];
  nutrition?: string;
}

type RecipeDetailsResponse = {
  title: string;
  image: string;
  link: string;
  category?: string;
  features?: string[];
  description?: string;
  ingredients?: string[];
  equipments?: string[];
  instructions?: string[];
  notes?: string[];
  tips?: string[];
  storage?: string[];
  swaps?: string[];
  nutrition?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: RecipeDetailsResponse;
};

type ScrapedRecipe = {
  title: string;
  image: string;
  link: string;
  category?: string;
  features?: string[];
};

interface MyRecipe {
  id: string;
  recipeName: string;
  recipeImage: string;
}

interface MyRecipeDetailsResponse {
  success?: boolean;
  message?: string;
  result?: {
    id: string;
    recipeName: string;
    duration: number | string;
    energy: number | string;
    features: string[];
    wyn: string;
    nutrition: string;
    hymi: string;
    recipeImage: string;
    youtubeLink: string;
  };
}
