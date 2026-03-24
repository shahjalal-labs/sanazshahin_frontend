import image1 from "@/assets/r1.jpg";
import image2 from "@/assets/r2.jpg";
import image3 from "@/assets/r3.png";
import image4 from "@/assets/r4.png";
import image5 from "@/assets/r5.png";
import image6 from "@/assets/r6.jpg";
import type { StaticImageData } from "next/image";

export interface Recipe {
  id: number;
  title: string;
  detailTitle: string;
  image: string | StaticImageData;
  serves: string;
  prepTime: string;
  extraTime: string;
  features: string[];
  needs: string[];
  pieces: string[];
  nutrition: string[];
  steps: string[];
  videoThumbnail: string;
  videoUrl: string;
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Green Goddess Dill Salad\n(with black-eyed peas)",
    detailTitle: "Green Goddess Dill Salad",
    image: image1,
    serves: "2-3 large servings or 4 small side servings",
    prepTime: "10 min prep salad",
    extraTime: "20 min to bake chickpeas",
    features: ["Meal Prep Friendly", "Leftover Friendly"],
    needs: [
      "1 1/2 cups basmati rice, rinsed and soaked for 30 minutes",
      "2 tbsp olive oil or avocado oil",
      "1 small onion, finely chopped",
      "2 cloves garlic, minced",
      "1 1/2 cups green beans, trimmed and cut into 1-inch pieces",
    ],
    pieces: [
      "3 tbsp tomato paste",
      "1 tsp ground turmeric",
      "1 tsp paprika powder",
      "1/2 tsp dried oregano",
      "1/2 tsp ground cinnamon",
      "1 cup water or vegetable broth",
      "Salt and pepper, to your taste",
      "pinch of saffron steeped in 2 tbsp hot water (optional)",
    ],
    nutrition: [
      "Servings 1",
      "Calories 290",
      "Carbohydrates 48g",
      "Fat 8g",
      "Fiber 4g",
      "Protein 6g",
      "Monounsaturated 5g",
      "Polyunsaturated 1g",
      "Saturated 1g",
      "Trans 0g",
      "Vitamin A 90 IU",
      "Vitamin C 8 mg",
      "Vitamin D 0 mg",
      "Calcium 40 mg",
      "Iron 2 mg",
      "Potassium 350 mg",
      "Cholesterol 0 mg",
      "Sodium 200 mg",
      "Sugar 4 g",
    ],
    steps: [
      "Bake the chickpea croutons: Preheat oven to 400F (200C). Toss chickpeas with paprika and onion powder. Spread on a baking sheet and bake for about 20 minutes, until crispy.",
      "Massage the kale: Place chopped kale in a large bowl. Drizzle with olive oil and sprinkle with nutritional yeast. Massage with your hands for a few minutes until the kale softens and darkens.",
      "Make the vegan Caesar dressing: Blend soaked cashews, lemon juice, garlic, Dijon mustard, capers, nutritional yeast, and water until smooth.",
      "Assemble the salad: Layer the massaged kale with chickpea croutons, sliced red onion, vegan Caesar dressing, cashew parmesan, smashed avocado, and black pepper.",
    ],
    videoThumbnail:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Kale Caesar Salad (vegan)",
    detailTitle: "Kale Caesar Salad (vegan)",
    image: image2,
    serves: "2-3 large servings or 4 small side servings",
    prepTime: "10 min to prep salad",
    extraTime: "20 min to bake chickpeas",
    features: ["Meal Prep Friendly", "Leftover Friendly"],
    needs: [
      "1 1/2 cups basmati rice, rinsed and soaked for 30 minutes",
      "2 tbsp olive oil or avocado oil",
      "1 small onion, finely chopped",
      "2 cloves garlic, minced",
      "1 1/2 cups green beans, trimmed and cut into 1-inch pieces",
    ],
    pieces: [
      "3 tbsp tomato paste",
      "1 tsp ground turmeric",
      "1 tsp paprika powder",
      "1/2 tsp dried oregano",
      "1/2 tsp ground cinnamon",
      "1 cup water or vegetable broth",
      "Salt and pepper, to your taste",
      "pinch of saffron steeped in 2 tbsp hot water (optional)",
    ],
    nutrition: [
      "Servings 1",
      "Calories 290",
      "Carbohydrates 48g",
      "Fat 8g",
      "Fiber 4g",
      "Protein 6g",
      "Monounsaturated 5g",
      "Polyunsaturated 1g",
      "Saturated 1g",
      "Trans 0g",
      "Vitamin A 90 IU",
      "Vitamin C 8 mg",
      "Vitamin D 0 mg",
      "Calcium 40 mg",
      "Iron 2 mg",
      "Potassium 350 mg",
      "Cholesterol 0 mg",
      "Sodium 200 mg",
      "Sugar 4 g",
    ],
    steps: [
      "Bake the chickpea croutons: Preheat oven to 400F (200C). Toss chickpeas with paprika and onion powder. Spread on a baking sheet and bake for about 20 minutes, until crispy.",
      "Massage the kale: Place chopped kale in a large bowl. Drizzle with olive oil and sprinkle with nutritional yeast. Massage with your hands for a few minutes until the kale softens and darkens.",
      "Make the vegan Caesar dressing: Blend soaked cashews, lemon juice, garlic, Dijon mustard, capers, nutritional yeast, and water until smooth.",
      "Assemble the salad: Layer the massaged kale with chickpea croutons, sliced red onion, vegan Caesar dressing, cashew parmesan, smashed avocado, and black pepper.",
    ],
    videoThumbnail:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Popcorn in a Bag",
    detailTitle: "Popcorn in a Bag",
    image: image3,
    serves: "1-2 servings",
    prepTime: "5 min prep",
    extraTime: "8 min cook",
    features: ["Quick", "Kid Friendly"],
    needs: ["1/4 cup popcorn kernels", "Paper bag", "Salt to taste"],
    pieces: ["1 tsp olive oil (optional)", "pinch of paprika"],
    nutrition: ["Servings 1", "Calories 120", "Carbohydrates 20g"],
    steps: [
      "Add kernels to paper bag.",
      "Fold bag tightly and microwave until popping slows.",
      "Season and serve.",
      "Enjoy warm.",
    ],
    videoThumbnail:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 4,
    title: "Sprouted Caesar Salad",
    detailTitle: "Sprouted Caesar Salad",
    image: image4,
    serves: "2 servings",
    prepTime: "15 min prep",
    extraTime: "5 min finish",
    features: ["Healthy", "High Fiber"],
    needs: ["Sprouts", "Romaine", "Lemon dressing"],
    pieces: ["Salt", "Pepper"],
    nutrition: ["Servings 2", "Calories 240"],
    steps: [
      "Wash and dry greens.",
      "Whisk dressing.",
      "Toss with sprouts.",
      "Serve immediately.",
    ],
    videoThumbnail:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 5,
    title: "Pistachio Granola Bars",
    detailTitle: "Pistachio Granola Bars",
    image: image5,
    serves: "8 bars",
    prepTime: "10 min prep",
    extraTime: "25 min bake",
    features: ["Meal Prep Friendly", "Snack"],
    needs: ["Oats", "Pistachio", "Honey"],
    pieces: ["Cinnamon", "Salt"],
    nutrition: ["Calories 190 per bar"],
    steps: ["Mix", "Press", "Bake", "Cool and cut"],
    videoThumbnail:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 6,
    title: "Chocolate Chip Oat Muffins\n(vegan + gluten-free)",
    detailTitle: "Chocolate Chip Oat Muffins (vegan + gluten-free)",
    image: image6,
    serves: "12 muffins",
    prepTime: "15 min prep",
    extraTime: "22 min bake",
    features: ["Vegan", "Gluten-free"],
    needs: ["Oat flour", "Plant milk", "Chocolate chips"],
    pieces: ["Baking powder", "Vanilla"],
    nutrition: ["Calories 170 each"],
    steps: ["Mix dry", "Mix wet", "Combine and bake", "Cool"],
    videoThumbnail:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=1200&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

export const getRecipeById = (id: number) => {
  return recipes.find((recipe) => recipe.id === id);
};
