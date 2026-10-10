# 👗 Sanaz Shahin — Luxury E-Commerce & Fashion Storefront

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix_UI" />
  <img src="https://img.shields.io/badge/E-Commerce-F43F5E?style=for-the-badge&logo=shoppingbag&logoColor=white" alt="E-Commerce" />
  
</p>

---

## 📌 Executive Overview

Sanaz Shahin delivers a sleek, minimalist digital storefront for high-end fashion and luxury apparel. Engineered with fluid animations, faceted product search, interactive lookbooks, and streamlined cart flows.

---

## 🚀 Key Frontend Engineering Highlights

- **Editorial Lookbooks**: Shoppable editorial visual stories with direct product tag overlays.
- **Faceted Attribute Filtering**: Multi-criteria search by size, color palette, fabric, and price range.
- **Persistent Cart State**: LocalStorage-synced shopping bag with slide-over drawer navigation.
- **Responsive Mobile-First**: Pixel-perfect typography and touch-optimized carousel gestures.
- **Micro-Interactions**: Hover previews, subtle image zoom, and instant feedback state transitions.

---

## 📂 Project Architecture

```plaintext
sanazshahin_frontend/
├── assets/
│   └── banner.svg         # UI architecture visual banner
├── src/
│   ├── components/        # Reusable design system primitives & UI atoms
│   ├── pages/ or app/     # Application routes & layouts
│   ├── hooks/             # Custom React hooks & state encapsulation
│   ├── services/          # API client endpoints & HTTP adapters
│   └── styles/            # Tailwind CSS configurations & themes
├── public/                # Static assets & icons
├── package.json
└── tsconfig.json
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/sanazshahin_frontend.git
cd sanazshahin_frontend
npm install
```

### 2. Environment Configuration
Create a local `.env` file if required:
```bash
cp .env.example .env 2>/dev/null || true
```

### 3. Run Development Server
```bash
npm run dev
```

Application will launch locally at `http://localhost:3000` or `http://localhost:5173`.

---

## 👨‍💻 Engineering & Authorship

Developed and maintained by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
