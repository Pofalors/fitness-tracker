# 💪 Fitness Tracker

A modern full-stack fitness tracking application built with React, TypeScript, and Firebase.

## ✨ Features

- 🔐 **Google Authentication** - Secure login with Firebase Auth
- 🏃 **Workout Tracking** - Log running, gym, yoga, and more
- ⏱️ **Stopwatch Timer** - Track workout duration in real-time
- 📊 **Statistics & Charts** - Visual progress with Recharts
- 📅 **Activity History** - View and filter past workouts
- 🎯 **Goal Setting** - Set weekly workout targets
- 🏆 **Achievement Badges** - Earn badges for milestones
- 📱 **PWA Ready** - Install on mobile devices
- 🌙 **Responsive Design** - Works on all devices

## 🛠️ Technologies

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Backend:** Firebase (Auth, Firestore)
- **Charts:** Recharts
- **Routing:** React Router DOM
- **Notifications:** React Hot Toast

## 🚀 Live Demo

[View Live Demo](https://fitness-tracker-sepia-one.vercel.app)

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*The central dashboard with statistics and quick actions*

### Καταγραφή Προπόνησης
![Track Workout](screenshots/track.png)
*Recording form with stopwatch and training type selection*

### Στατιστικά
![Statistics](screenshots/statistics.png)
*Progress charts and statistical analysis*

### Προφίλ & Badges
![Profile](screenshots/profile.png)
*User profile with goals, streaks, and achievements*

## 🏗️ Installation

1. Clone the repository
```bash
git clone https://github.com/Pofalors/fitness-tracker.git
```

2. Install dependencies
```bash
cd fitness-tracker
npm install
```

3. Create `.env` file with Firebase config
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run development server
```bash
npm run dev
```

## 📱 PWA Installation

The app can be installed on mobile devices:
- **iOS:** Share → Add to Home Screen
- **Android:** Menu → Install App
- **Desktop:** Click install icon in address bar

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT
