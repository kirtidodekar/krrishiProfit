# 🌾 KrrishiProfit

**KrrishiProfit** is a modern web application designed to help farmers and agri-businesses make smarter decisions and improve profitability through technology.

## 🚀 Tech Stack
- React + Vite  
- TypeScript
- Firebase Authentication
- Tailwind CSS
- ShadCN UI Components
- Framer Motion

## ✨ Features
- **Authentication**: Firebase-powered authentication with email/password and Google Sign-In
- **User Roles**: Different experiences for farmers and buyers
- **Marketplace**: Buy and sell agricultural waste products
- **Analytics**: Track sales, earnings, and performance metrics
- **Mobile Optimized**: Responsive design optimized for mobile devices

## 🛠️ Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and add your Firebase configuration:
```bash
cp .env.example .env
# Then update the values in .env with your Firebase project credentials
```

3. Start the development server:
```bash
npm run dev
```

## 🔐 Firebase Authentication Setup

The app uses Firebase Authentication for secure user management:

- **Auth Context**: Manages user state and authentication methods
- **Protected Routes**: Restricts access to authenticated users
- **Login/Signup Pages**: Complete authentication flows with validation
- **Social Login**: Google Sign-In integration

To configure Firebase authentication:
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password and Google authentication providers
3. Copy your Firebase configuration from the project settings
4. Add the configuration to your `.env` file as shown in `.env.example`