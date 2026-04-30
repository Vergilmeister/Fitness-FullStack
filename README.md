# 🚀 FitLife – Sports & Fitness Management System

FitLife is a premium, full-stack web application designed to help users manage their fitness journey with ease. From tracking workouts and goals to receiving AI-powered personalized coaching, FitLife provides all the tools needed for a healthier lifestyle.

![FitLife Banner](https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

---

## ✨ Features

### 🧠 AI Fitness Coach (Powered by Google Gemini)
Get personalized workout plans and diet suggestions based on your age, goals, and activity level. Simply enter your details and let our AI generate a 7-day plan for you.

### 📊 Comprehensive Dashboard
Visualize your progress with interactive charts powered by **Chart.js**. Track your calories burned, workout consistency, and goal status in real-time.

### 💬 Community Chat
Connect with other fitness enthusiasts in a real-time community chat powered by **Socket.IO**. Share motivation, tips, and achievements instantly.

### 🏋️ Workout & Goal Management
- **Log Workouts**: Keep a detailed history of your exercises, duration, and calories.
- **Set Goals**: Define your fitness milestones and track your progress toward them.
- **Calculators**: Built-in BMI and fitness calculators to monitor your health metrics.

### 🔐 Secure Authentication
Robust user registration and login system using **JWT (JSON Web Tokens)** and **BcryptJS** for password encryption.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 & CSS3 (Premium Dark Theme)
- JavaScript (ES6+)
- [Socket.IO Client](https://socket.io/)
- [Chart.js](https://www.chartjs.org/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [Google Gemini API](https://ai.google.dev/) (AI integration)
- [Socket.IO](https://socket.io/) (Real-time features)

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anuj-Thakur-afk/Sports-and-fitness.git
   cd Sports-and-fitness/FitLife
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the application:**
   ```bash
   # Start the server (Backend & Frontend)
   npm run dev
   ```

5. **Open in Browser:**
   Visit `http://localhost:5000`

---

## 📂 Project Structure

Fitness-FullStack/
│
├── frontend/ # UI (HTML, CSS, JS)
├── backend/ # Server & API logic
├── models/ # Database schemas
├── routes/ # API routes
├── middleware/ # Auth middleware
├── .env # Environment variables
└── README.md
---

API Endpoints

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | /auth/register | Register new user      |
| POST   | /auth/login    | Login user             |
| GET    | /profile       | Get user profile       |
| POST   | /ai/suggest    | Get AI fitness plan    |
| GET    | /history       | Fetch past suggestions |

## 🤝 Contributing
Contributions are welcome! Please fork the repo and create a pull request.

**Developed with ❤️ by Abhay Patel**
