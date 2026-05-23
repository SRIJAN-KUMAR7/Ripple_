# Ripple - Real-time Messaging Web Application

Ripple is a modern, secure, and feature-rich full-stack chat application designed for seamless communication. It leverages real-time technologies and a robust security layer to provide a premium user experience.

## 🚀 Achievements & Key Features

### 📨 Real-Time Communication
- **Instant Messaging**: Powered by **Socket.io** for low-latency, real-time message delivery.
- **Online Presence**: Real-time tracking of online/offline status for all users.
- **Typing Indicators**: Visual feedback when a contact is typing (implemented/ready).

### 🔐 Security & Authentication
- **Multi-layered Auth**: JWT-based authentication with secure cookie storage.
- **Google OAuth**: Integrated **Google Login** for a seamless onboarding experience.
- **Secure Architecture**: 
  - **Arcjet Integration**: Advanced protection against bots, rate-limiting, and malicious attacks.
  - **Password Hashing**: Industry-standard **bcryptjs** for securing user credentials.
  - **Route Protection**: Middleware-controlled access to private routes and APIs.

### 🖼️ Rich Messaging Experience
- **Multimedia Support**: Seamless image sharing integrated with **Cloudinary** for cloud-based storage and optimization.
- **Emoji Support**: Integrated emoji picker for expressive communication.
- **Animated UI**: Smooth transitions and micro-animations for a premium feel.
- **Instant Notifications**: Real-time feedback using **React Hot Toast**.

### 🎨 Modern UI/UX
- **Dynamic Theming**: Support for multiple themes (Light, Dark, and more) using **DaisyUI** and **Tailwind CSS**.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **State Management**: Scalable and clean state handling using **Zustand**.

### 🛠️ Backend Excellence
- **Scalable API**: RESTful API built with **Express.js**.
- **Database**: **MongoDB** with **Mongoose** for flexible and efficient data modeling.
- **Email Integration**: Integrated with **Resend** for potential OTP or notification services.
- **Deployment Ready**: Configured for unified deployment (Frontend served via Express).

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Real-time**: [Socket.io-client](https://socket.io/)
- **Auth**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/)
- **Security**: [Arcjet](https://arcjet.com/)
- **Mailing**: [Resend](https://resend.com/)

---

## 📂 Project Structure

```text
Ripple/
├── backend/                # Express & Node.js server
│   ├── src/
│   │   ├── controllers/    # Business logic for routes
│   │   ├── lib/            # Configuration (DB, Socket, Env)
│   │   ├── middleware/     # Auth & Security middlewares
│   │   ├── models/         # Mongoose schemas
│   │   └── routes/         # API endpoints
│   └── server.js           # Main entry point
├── frontend/               # React & Vite client
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views
│   │   ├── store/          # Zustand state stores
│   │   └── lib/            # Axios and other utils
└── package.json            # Tooling and workspace config
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Cloudinary account credentials
- Google OAuth credentials (optional for Google Login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Ripple
   ```

2. **Backend Setup**
   - Navigate to `backend/`
   - Create a `.env` file with required variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_URL`, etc.)
   - Run `npm install`
   - Start development server: `npm run dev`

3. **Frontend Setup**
   - Navigate to `frontend/`
   - Create a `.env` file with `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID`
   - Run `npm install`
   - Start Vite: `npm run dev`

---

## 🌟 Future Roadmap
- [ ] End-to-End Encryption for messages.
- [ ] Group Video Calls.
- [ ] Message search functionality.
- [ ] Voice messages support.

---
*Created with ❤️ as a modern communication platform.*