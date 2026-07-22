# Frontend AI Capstone

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A Frontend AI Engineering capstone repository that will be developed throughout the internship. This repository contains the initial project setup, documentation, and follows AI-assisted development practices. This repository serves as the submission for the **FE-01 Frontend AI Engineering Internship Assignment**.

---

## 🚀 Overview

The **Frontend AI Capstone** is a state-of-the-art web application developed to explore and demonstrate the convergence of modern frontend web technologies with interactive artificial intelligence workflows. The project focuses on high visual excellence, rich micro-animations, glassmorphism aesthetics, responsive layouts, and robust application architecture.

---

## ✨ Key Features

- 🤖 **Interactive AI Assistant**: Real-time streaming chat interface with markdown formatting, code block syntax highlighting, and conversation history persistence.
- 🎨 **Premium UI/UX Design**: Elegant glassmorphic dashboard built on CSS custom properties, featuring seamless dark/light mode toggling and rich micro-interactions.
- ⚙️ **Prompt Engineering Playground**: Dynamic controls for system instructions, temperature settings, and modular model selectors.
- ⚡ **Performance & SEO**: Highly optimized Next.js Server Components, responsive layout paradigms, and SEO best practices.

---

## 🛠️ Tech Stack & Key Technologies

- **Core Structure & Styling**:
  - HTML5 & CSS3 (Vanilla CSS for maximum styling control and customized design systems)
  - JavaScript (ES6+) & TypeScript for type-safe development
- **Frameworks & UI Libraries**:
  - React 18 (Component-driven architecture)
  - Next.js 14 (App Router, Server Components, and optimized rendering)
- **Version Control & Collaboration**:
  - Git & GitHub for source control and collaboration workflow

---

## 📁 Project Structure

Below is the conceptual structure of the repository, adhering to modern Next.js App Router best practices:

```text
frontend-ai-capstone/
├── public/                  # Static assets (images, icons, fonts)
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── layout.tsx       # Root layout defining HTML structure & global metadata
│   │   └── page.tsx         # Main entry page / dashboard
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Atom level design components (buttons, inputs)
│   │   └── ai/              # AI-specific components (chat panel, prompt builder)
│   ├── styles/              # Design system and style sheets
│   │   └── globals.css      # Core variables, styling tokens, and resets
│   ├── utils/               # Helper functions and utilities
│   └── types/               # TypeScript interfaces and declarations
├── .gitignore               # Ignored files for version control
├── LICENSE                  # Project license
├── package.json             # Project dependencies and script runner configurations
└── README.md                # Project documentation (this file)
```

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later) or **yarn** / **pnpm**

### Step-by-Step Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/frontend-ai-capstone.git
   cd frontend-ai-capstone
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(or use `yarn install` or `pnpm install` if preferred)*

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   # API Key for Gemini (Primary AI Engine)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

   # Optional alternate AI keys
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

---

## 🏃 How to Run the Project

Once the installation is complete, you can start the application locally using the following scripts:

### Development Server
To launch the project in development mode with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
To create an optimized production build of the application:
```bash
npm run build
```

### Production Execution
To run the built production bundle locally:
```bash
npm run start
```

### Linting
To analyze the codebase for linting errors and run static analysis:
```bash
npm run lint
```

---

## 🗺️ Future Roadmap

- [ ] **AI Integration**: Connect frontend UI elements to real-time LLM endpoints (e.g., Gemini API or OpenAI API).
- [ ] **Dynamic Themes & Styling**: Fully implement a robust design system with light, dark, and glassmorphic themes.
- [ ] **Micro-animations**: Integrate Framer Motion or custom CSS transitions for premium, fluid user feedback.
- [ ] **Performance Auditing**: Optimize bundle sizes and achieve perfect Lighthouse/SEO scores.
- [ ] **State Management**: Add context API or Zustand store for advanced global state management.

---

## 📄 License

This project is licensed under the **MIT License**. For details, please see the [LICENSE](LICENSE) file.
