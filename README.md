# 🛍️ Ecommerce Fullstack App

A full-featured e-commerce application built with **React**, **Node.js**, **Express**, **MongoDB**, **Stripe**, **Zustand**, and **React Query**.

Users can browse products, add to cart, check out securely via Stripe, and manage orders. Admins can create, update, and delete products with image uploads.

---

## 🔧 Tech Stack

### Frontend
- React
- React Router
- Zustand (State Management)
- React Query (API Caching)
- TailwindCSS (UI Styling)
- Stripe Checkout
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication
- Stripe API


---

## 📸 Screenshots

### 🏠 Home Page  
![Home 1](./client/screenshots/Home1.jpg)  
![Home 2](./client/screenshots/Home2.jpg)

### 🛠️ Admin Page  
![Admin](./client/screenshots/Admin.jpg)

### 🔐 Login Page  
![Login](./client/screenshots/Login.jpg)

---

## 🚀 Features

- 🔍 Browse and filter products
- 🛒 Add to cart and checkout
- 👤 JWT-based authentication
- 💳 Stripe payment integration
- 🧑‍💼 Admin panel for managing products
- 🧾 Order and stock tracking
- ⚡ Optimistic UI updates with React Query

---

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/Behrad-BeigZadeh/ecommerce-fullstack.git
cd ecommerce-fullstack

### 🧰 Backend

1. Go to the Root folder
2. Install dependencies:
   ```bash
   npm install

### Set up environment variables  
-PORT=5000
-CLIENT_URL=http://localhost:5173
-MY_EMAIL=for_resetting_password
-APP_PASSWORD=for_resetting_password
-MONGO_URI=your_mongo_connection_string
-JWT_SECRET=your_jwt_secret
-STRIPE_SECRET_KEY=your_stripe_secret_key
-ARCJET_KEY=Your_Key
-ARCJET_ENV=development | production

npm run dev

---


  ### 🧰 Frontend

1. Go to the `ckient/` folder
2. Install dependencies:
   ```bash
   npm install


### Set up environment variables
-VITE_API_BASE_URL=http://localhost:5000
-VITE_STRIPE_PUBLISHABLE_KEY=Your_key

npm run dev


🧪 Stripe Test Card
To test Stripe payments, use the test card below:
Card Number: 4242 4242 4242 4242  
Exp Date: Any future date  
CVC: Any 3 digits  
ZIP: Any 5 digits  





