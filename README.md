<div align="center">
  <img src="./frontend/public/ChatScope.png" alt="ChatScope Logo" width="120" />
  <h1>ChatScope</h1>
  <p><strong>Advanced WhatsApp Chat Analytics & AI Insights</strong></p>

  <p>
    <a href="https://chat-scope-rose.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Available-00a884?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>

  <p><h3><a href="https://chat-scope-rose.vercel.app/">Try out ChatScope Live!</a></h3></p>
</div>

<br />

ChatScope is a powerful, privacy-first web application designed to transform your raw WhatsApp `.txt` export logs into stunning visualizations and deep psychological insights. By leveraging modern data parsing and advanced AI Language Models, ChatScope reveals hidden patterns in your conversations without ever compromising your data privacy.

---

##  Core Features

###  **Dashboard & Activity Maps**
* **Instant Overviews:** View total message counts, active participant leaderboards, and top emojis at a glance.
* **Timeline Analysis:** Track message frequencies across days and months to see when your conversations peak.
* **Hourly Heatmaps:** Beautiful bar and pie charts map out the busiest hours of the day and who dominates the conversation.

###  **Linguistic & Word Analysis**
* **Vocabulary Tracking:** Discover exactly which words are used the most by each specific participant.
* **Emoji Usage:** A detailed breakdown of the most frequently used emojis.
* **Typing Habits:** Calculates average message lengths to reveal who sends short bursts and who writes long paragraphs.

###  **Neural AI Insights (Powered by Groq)**
* **Psychological Profiling:** Generates dynamic personality archetypes for participants based on their messaging style.
* **Sentiment Analysis:** Calculates the overall emotional tone of the timeline (e.g., 85% Positive, 10% Banter, 5% Conflict).
* **Communication Dynamics:** The AI strictly analyzes the interaction style, reading between the lines without storing the raw text.

###  **Interactive AI Chat Analyst**
* **Chat with your Chat:** An interactive terminal where you can ask free-form questions about the conversation history (e.g. *"Who texts first usually?"* or *"What is our most talked about topic?"*).
* **Context-Aware:** The AI handles regional languages, Manglish, and heavy slang natively.

---

##  Strict Privacy System (Zero-Retention)
We believe your private conversations shouldn't be trained on or sold.
* **Memory-Only Processing:** When you upload your `.txt` file, it is read entirely in temporary RAM. The `.txt` file is **never** saved to our servers' hard drives.
* **Ephemeral Database Sessions:** Upon processing, the anonymous numerical statistics and only a snippet of the *last 50 messages* are temporarily held in our MongoDB database. 
* **Safe AI:** We use Groq API (Llama 3.1) which strictly prohibits training their models on our user requests. We do *not* use ChatGPT for data privacy reasons.
* **Instant "Clear Data" Wipe:** The UI provides a manual "Clear Data" button which fires an immediate `deleteOne()` backend command, instantly purging your temporary session from our database and wiping your local browser cache. Leaving **zero** trace.

---

##  Technology Stack

**Frontend**
* **React 18** (Vite + TypeScript)
* **Tailwind CSS & Shadcn UI** (Component Library)
* **Framer Motion** (Smooth Micro-animations & Transitions)
* **Zustand** (Local, persistent State Management)
* **Recharts** (Data Visualization)
* *WhatsApp Dark Theme deeply integrated across the UI.*

**Backend**
* **Node.js & Express.js** (TypeScript)
* **MongoDB + Mongoose** (Session Management)
* **Groq SDK** (AI LLM inference)
* **Multer** (In-memory file buffer processing)

---

##  Running ChatScope Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- A free API key from [Groq Console](https://console.groq.com/)

### 1. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/chatscope
GROQ_API_KEY=your_groq_api_key_here
```
Run the server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory (if using variable routing):
```env
VITE_API_URL=http://localhost:3000
```
Run the client:
```bash
npm run dev
```

### 3. Usage
Simply visit `http://localhost:5173`, click **Upload Chat**, drop your WhatsApp `.txt` file, and dive into the analytics!
