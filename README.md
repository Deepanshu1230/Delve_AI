Delve AI 🔍

<img width="1355" height="644" alt="image" src="https://github.com/user-attachments/assets/46d95b73-429e-409d-be63-38356aca5e9b" />


![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Delve AI** is a premium, Perplexity-inspired AI research application designed for "a quieter search." It features a custom streaming architecture that delivers chunk-by-chunk LLM responses, seamlessly parsing structured AI metadata into a highly interactive, glassmorphic UI.

---

## 🚀 Live Demo
(https://delve-ai-web.vercel.app/)

## 🔄 Application Workflow

1. **User Input:** The user submits a query via the Next.js glassmorphic UI.
2. **API Trigger:** The frontend initiates a connection to the Express backend (hosted on Render).
3. **Database Validation:** The backend uses Prisma and Supabase's connection pooler (Port 6543) to fetch conversation history and validate the session.
4. **LLM Processing:** The backend forwards the contextualized prompt to the AI model.
5. **Real-Time Streaming:** As the LLM generates tokens, the Express backend pipes them directly to the client as a readable stream.
6. **Dynamic Parsing:** The frontend's `useDelveStream` hook captures the stream, strips backend-specific XML tags (like `<ANSWER>` or `<FOLLOWUPS>`), and buffers the raw text.
7. **Progressive Rendering:** `react-markdown` instantly renders the buffered text to the screen, providing a smooth typewriter effect without UI flickering.

## ✨ Key Features
- **Real-Time AI Streaming:** Utilizes standard node streams and custom buffers to render AI responses word-by-word without UI flickering.
- **Dynamic Metadata Parsing:** Custom regex parsers strip out `<ANSWER>`, `<SOURCES>`, and `<FOLLOWUPS>` tags on the fly, rendering follow-up questions as interactive UI components at the end of the stream.
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for smooth layout transitions, featuring responsive light/dark modes, markdown rendering, and typing indicators.
- **Robust Connection Pooling:** Built on a Supabase-hosted PostgreSQL instance using port 6543, optimized for serverless environments with `@prisma/adapter-pg`.

## 🛠️ Tech Stack

**Frontend (Client)**
- Next.js (App Router)
- TypeScript
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
  git clone [https://github.com/Deepanshu1230/Delve_AI.git]
cd delve-ai
cd apps/web
bun run dev  ("This is for running Frontend")
