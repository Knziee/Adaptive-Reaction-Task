# 🧠 Reaction Time Experiments – Next.js + jsPsych + Firebase

A simple front-end demo built with **Next.js**, **React**, **TypeScript**, **jsPsych**, and **Firebase**.  
This project allows users to run basic and advanced reaction time experiments and save results to Firebase.

## 🌐 Live Demo

**[🔗 View Live Application]([https://your-deployed-link-here.com](https://adaptive-reaction-task.vercel.app/)**

---

## 🚀 Features

- **Two experiment modes**
  - 🎯 Basic Reaction Time (SPACE key)
  - 🔬 Advanced Color Reaction (F / J keys)
- **Firebase result storage**
  - Saves accuracy, mean reaction time, and raw trials
- **Results view page**
  - Fetches and displays recent experiment submissions
- **React + Next.js integration**
  - Fully client-side components using `"use client"`
- **Clean jsPsych wrappers**
  - Custom timelines  
  - Stimuli randomization  
  - On-finish callbacks  

---

## 📁 Project Structure

/app
  /components
    RTExperiment.tsx
    AdvancedRTExperiment.tsx
    ResultsView.tsx
    page.tsx
layout.tsx
globals.css

  /service
    saveResult.ts
    getResults.ts
    firebase.ts

  /types
    types.ts

## 🛠️ Technologies Used

- **Next.js**
- **React**
- **TypeScript**
- **jsPsych**
- **Firebase Firestore database**
- **React Hot Toast**
- **Vercel**

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Knziee/Adaptive-Reaction-Task.git
cd reaction-time-demo

npm install

Create a .env.local file in the project root:

NEXT_PUBLIC_FIREBASE_API_KEY=yourApiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourAuthDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourProjectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourStorageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=yourMessagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=yourAppId
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=yourMeasurementId

npm run dev

http://localhost:3000
```

## 🧱 Extending the Project

Ideas to expand this project:

**User Management**
- User authentication (Google, email/password, etc.)

**Experiment Features**  
- Additional jsPsych plugins
- Adaptive difficulty
- Multi-user experiments / lobbies (using Firebase Realtime Database)

**Data & Analysis**
- CSV export, dashboards, or integrations with data analysis tools



