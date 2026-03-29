import r1 from "@/assets/r1.jpg";
import r2 from "@/assets/r2.jpg";
import r3 from "@/assets/r3.png";
import r4 from "@/assets/r4.png";
import r5 from "@/assets/r5.png";
import r6 from "@/assets/r6.jpg";
import type { StaticImageData } from "next/image";

export interface GroceryRecipeCard {
  id: number;
  title: string;
  image: StaticImageData;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
}

export interface GrocerySection {
  id: string;
  title: string;
  items: GroceryItem[];
}

export interface GroceryRecipeDetail {
  id: number;
  title: string;
  sections: GrocerySection[];
}

export const groceryRecipeCards: GroceryRecipeCard[] = [
  {
    id: 1,
    title: "Sprouted Caesar Salad",
    image: r4,
  },
  {
    id: 2,
    title: "Creamy Hummus",
    image: r2,
  },
  {
    id: 3,
    title: "Popcorn in a Bag",
    image: r3,
  },
  {
    id: 4,
    title: "Green Goddess Dill Salad\n(with black-eyed peas)",
    image: r1,
  },
  {
    id: 5,
    title: "Pistachio Granola Bars",
    image: r5,
  },
  {
    id: 6,
    title: "Herb Pasta",
    image: r6,
  },
];

const defaultSections: GrocerySection[] = [
  {
    id: "produce",
    title: "Produce",
    items: [
      { id: "tomatoes", name: "Tomatoes", quantity: "3 pcs" },
      { id: "green-beans", name: "Green Beans", quantity: "200 g" },
      { id: "onion", name: "Onion", quantity: "1 pc" },
      { id: "garlic", name: "Garlic", quantity: "3 cloves" },
    ],
  },
  {
    id: "dairy",
    title: "Dairy",
    items: [
      { id: "yogurt", name: "Yogurt", quantity: "1 cup" },
      { id: "butter-dairy", name: "Butter", quantity: "100 g" },
    ],
  },
  {
    id: "grains",
    title: "Grains",
    items: [
      { id: "basmati-rice", name: "Basmati Rice", quantity: "2 cups" },
      { id: "butter-grains", name: "Butter", quantity: "100 g" },
    ],
  },
];

export const groceryRecipeDetails: GroceryRecipeDetail[] =
  groceryRecipeCards.map((recipe) => ({
    id: recipe.id,
    title: recipe.id === 2 ? "Kale Caesar Salad (vegan)" : recipe.title,
    sections: defaultSections,
  }));

export const getGroceryRecipeById = (id: number) => {
  return groceryRecipeDetails.find((recipe) => recipe.id === id);
};
