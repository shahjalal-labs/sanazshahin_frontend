# 🥗 Sanaz Shahin — Personalized Nutrition, Meal Planning & Recipe Box Client

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js_16" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React_18" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turbopack-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Turbopack" />
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant_Design" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux_Toolkit" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Nutrition_Tech-10B981?style=for-the-badge&logo=activity&logoColor=white" alt="Nutrition_Tech" />
  
</p>

---

## 📌 Executive Overview

**Sanaz Shahin Frontend** is a modern dietary health and meal planning web application engineered with **Next.js 16 (Turbopack, App Router)**. The platform enables health-conscious individuals to calculate daily protein and macronutrient targets, curate personalized weekly meal plans, discover nutritionist-crafted recipes, save favorite dishes to their digital Recipe Box, and auto-generate organized grocery shopping checklists.

---

## 🚀 Key Engineering & Domain Capabilities

- **Automated Protein & Macro Calculator**: Calculates personalized daily caloric and macronutrient targets based on user biometric goals.
- **Interactive Weekly Meal Planner**: Drag-and-drop meal schedule generator for breakfast, lunch, dinner, and healthy snacks.
- **Curated Recipe Box**: Rich recipe discovery with dietary tags (keto, high-protein, vegan), cooking times, and nutritional breakdowns.
- **Dynamic Grocery List Generator**: Automatically aggregates ingredients from active weekly meal plans into categorized supermarket shopping lists.
- **Next.js 16 Modern Architecture**: Built on App Router with `(default)` and `(AuthLayout)` route groups, animated micro-interactions, and responsive mobile-first UI.

---

## 🏛️ Application Architecture & Route Tree

```plaintext
sanazshahin_frontend/
├── assets/
│   └── banner.svg                     # High-resolution architectural banner
├── src/
│   ├── app/
│   │   ├── (AuthLayout)/              # User onboarding, login & password recovery
│   │   ├── (default)/
│   │   │   ├── protein-calculator/    # Interactive macronutrient calculation engine
│   │   │   ├── meal-plans/            # Weekly meal scheduling calendar
│   │   │   ├── recipe/                # Recipe discovery, instructions & ingredients
│   │   │   ├── recipe-box/            # Saved recipes and favorites collection
│   │   │   ├── grocery-list/          # Auto-generated shopping checklist
│   │   │   ├── profile/               # Biometric preferences & dietary goals
│   │   │   └── notifications/         # Meal reminders and recipe updates
│   │   ├── layout.tsx                 # Root layout with Redux & Theme providers
│   │   └── globals.css                # Tailwind CSS styling
│   ├── components/                    # Modular meal plan cards, calculator sliders
│   └── redux/                         # RTK Query API endpoints & meal plan state
├── package.json                       # Next.js 16.1.6, React 18, Tailwind CSS
└── tsconfig.json
```

---

## 💻 Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Framework** | **Next.js 16** (App Router, Turbopack, Server/Client Components) |
| **UI Components** | Ant Design, Lucide Icons, Custom Tailwind Primitives |
| **State Management** | Redux Toolkit (RTK), RTK Query API Caching |
| **Styling** | Tailwind CSS 3.4, PostCSS, Responsive Mobile-First Theme |
| **Language** | TypeScript 5 (Strict Mode) |

---

## 🛠️ Getting Started & Local Development

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `yarn`, or `pnpm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/sanazshahin_frontend.git
cd sanazshahin_frontend
npm install
```

### 2. Configure Environment Variables
Create a local `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server (Turbopack)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
