# 🎲 Dice & Dine Backend

The backend service for the Dice & Dine application—a platform that combines the joy of board gaming with dining experiences. This API handles user management, game and restaurant data, reservations, and more.

---

## 📦 Features

* **User Management**: Registration, authentication, and profile handling.
* **Game Library**: CRUD operations for board games.
* **Food orders**: Create food orders.
* **Reservations**: Book tables and games.
* **Image Uploads**: Support for uploading a profile picture.
* **Admin Controls**: Controls for managing reservations, orders, customers and more.

---

## 🛠️ Tech Stack

* **Backend**: Node.js with Express.js
* **Language**: JavaScript
* **Database**: MySQL
* **Authentication**: JWT (JSON Web Tokens)
* **File Uploads**: Multer
* **Linting & Formatting**: ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* MySQL database populated with all the required tables.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Aarojy/dice-and-dine-backend.git
   cd dice-and-dine-backend
   ```



2. **Install dependencies**:

   ```bash
   npm install
   ```



3. **Set up environment variables**:

   Create a `.env` file in the root directory based on `.env_sample` and configure the following variables:

   ```env
   # 🗄️ MySQL Database Configuration
   DB_HOST=           # The hostname or IP address of your MySQL server (e.g., localhost or 127.0.0.1)
   DB_USER=           # MySQL username used to connect to the database
   DB_PASSWORD=       # Password for the MySQL user
   DB_NAME=           # Name of the MySQL database to use

   # 🔐 Authentication
   JWT_SECRET=your_jwt_secret  # Secret key used to sign and verify JWT tokens for secure user authentication

   # 🚍 Transit API
   DIGITRANSIT_URL=           # Base URL for the Digitransit API (e.g., https://api.digitransit.fi/routing/v1/)
   DIGITRANSIT_API_KEY=       # API key to authenticate requests to Digitransit for transit/location services
   ```



4. **Start the development server**:

   ```bash
   npm run dev
   ```



The server will run on `http://localhost:3001`.

---

## 📁 Project Structure

```bash
dice-and-dine-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
├── uploads/            # Directory for uploaded images
├── seeds/              # Seed data for initial setup
├── .env_sample         # Sample environment variables
├── package.json
└── tsconfig.json

```

## 🌐 Frontend Repository

The frontend for this project can be found here:
👉 [Dice & Dine Frontend]([https://github.com/WelehoBRUDER/dice-and-dine-frontend])

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).([GitHub][4])

---

