# 🛍️ Ecommerce Fullstack App

A full-stack e-commerce application built with **React**, **Node.js**, **Express**, **MongoDB**, **Stripe**, **Zustand**, and **React Query**. It features product browsing, shopping cart, checkout, authentication, and an admin panel for product management.

---

## 📸 Screenshots


| Home Page | Product Detail | Admin Panel |
|-----------|----------------|-------------|
| ![](./screenshots/home.png) | ![](./screenshots/product.png) | ![](./screenshots/admin.png) |

---

## 🔧 Tech Stack

### Frontend
- React
- React Router
- Zustand
- React Query
- TailwindCSS
- Stripe Checkout
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Auth
- Stripe API
- Cloudinary (for image upload)

---

## 🚀 Features

- ✅ Browse and filter products
- 🛒 Add to Cart / Remove from Cart
- 🔐 User Authentication (JWT-based)
- 💳 Stripe Checkout Integration
- 🧑‍💼 Admin Panel for CRUD operations
- 🖼️ Image Upload (via Cloudinary)
- 📦 Stock quantity management
- ⚡ Optimistic UI with React Query

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/Behrad-BeigZadeh/ecommerce-fullstack.git
cd ecommerce-fullstack 



## 🔙 Backend Setup
   cd backend
   npm install
Create a .env file inside the backend directory:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

   npm run dev

## 🖥️ Frontend Setup
  cd frontend
  npm install
Create a .env file inside the frontend directory:
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name

  npm run dev


🧪 Stripe Test Card
To test payments, use the following test card:

Card Number: 4242 4242 4242 4242  
Exp: Any future date  
CVC: Any 3 digits  




