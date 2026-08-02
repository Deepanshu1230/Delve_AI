# Delve AI 🔍

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Delve AI** is a premium, Perplexity-inspired AI research application designed for "a quieter search." It features a custom streaming architecture that delivers chunk-by-chunk LLM responses, seamlessly parsing structured AI metadata into a highly interactive, glassmorphic UI.

---

## 🚀 Live Demo
- **Frontend (Vercel):** [Insert Vercel Link Here]
- **Backend API (Render):** [Insert Render Link Here]

## ✨ Key Features
- **Real-Time AI Streaming:** Utilizes standard node streams and custom buffers to render AI responses word-by-word without UI flickering.
- **Dynamic Metadata Parsing:** Custom regex parsers strip out `<ANSWER>`, `<SOURCES>`, and `<FOLLOWUPS>` tags on the fly, rendering follow-up questions as interactive UI components at the end of the stream.
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for smooth layout transitions, featuring responsive light/dark modes, markdown rendering, and typing indicators.
- **Robust Connection Pooling:** Built on a Supabase-hosted PostgreSQL instance using port 6543, optimized for serverless environments with `@prisma/adapter-pg`.

## 🛠️ Tech Stack

**Frontend (Client)**
- Next.js (App Router)
- React & TypeScript
- Tailwind CSS & Framer Motion
- `react-markdown` & `remark-gfm` for rich text formatting

**Backend (Server)**
- Express.js & Node.js
- Prisma ORM (`@prisma/client` & `@prisma/adapter-pg`)
- Supabase (PostgreSQL Database & JWT Auth validation)
- Bun (Runtime environment)

---

## 💻 Local Setup & Development

### Prerequisites
Make sure you have [Bun](https://bun.sh/) and [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/delve-ai.git](https://github.com/your-username/delve-ai.git)
cd delve-ai
