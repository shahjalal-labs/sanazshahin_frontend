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
