# 🔐 User Panel – Backend (API)

This is the **Node.js + Express** backend for the User Panel system. It handles registration, login, JWT-based authentication, and user management.

## ⚙️ Features

- Admin Registration & Login
- JWT token generation for secure access
- Password hashing using bcrypt
- User data stored in PostgreSQL or MongoDB (configurable)

## 🧰 Tech Stack

- Node.js
- Express.js
- bcrypt
- JSON Web Token (JWT)
- PostgreSQL / MongoDB (choose your DB)



## 🔐 API Endpoints

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| POST   | `/api/register`  | User registration     |
| POST   | `/api/login`     | User login & JWT      |

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/User-backend
cd admin-backend
npm install
npm start
