# 💰 Money Guard – Backend API

Welcome to the **Money Guard Backend**, the core engine powering the [Money Guard App](https://money-g-project-group-02.vercel.app/), a simple yet effective personal finance tracker.

Money Guard helps users **securely manage their finances**, track expenses, and view summarized reports with ease.
This backend provides **robust authentication**, **CRUD operations for transactions**, and **comprehensive API documentation** via Swagger.

> 👉 **Frontend Repository:** [Money Guard Frontend on GitHub](https://github.com/DarkLordSith/MoneyG_Project_group-02) <br>
> 👉 **Live App:** [Money Guard on Vercel](https://money-g-project-group-02.vercel.app/)

---

## 🚀 Key Features

* 🔐 **Authentication & Authorization**

  * User registration, login, logout, session refresh, and profile retrieval.
* 💸 **Transaction Management**

  * Full CRUD operations for personal transactions.
  * Monthly financial summaries to help track spending trends.
* 📑 **Swagger Documentation**

  * Interactive API documentation available via Swagger UI.
* ⚡ **Modern Tech Stack**

  * RESTful API design powered by Node.js and Express.
  * Swagger (OpenAPI 3.1) for seamless API exploration.

---

## 📂 API Overview

### Base URL

```text
http://127.0.0.1:3000
```

### Authentication Endpoints

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | /auth/register | Register a new user        |
| POST   | /auth/login    | Log in an existing user    |
| POST   | /auth/logout   | Log out the current user   |
| POST   | /auth/refresh  | Refresh user session token |
| GET    | /auth/current  | Retrieve current user info |

### Transaction Endpoints

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| GET    | /transactions                 | Get all user transactions       |
| POST   | /transactions                 | Create a new transaction        |
| PATCH  | /transactions/{transactionId} | Update a specific transaction   |
| DELETE | /transactions/{transactionId} | Delete a specific transaction   |
| GET    | /transactions/summary         | Get monthly transaction summary |

---

## 📚 Swagger Documentation

Explore and test all API routes using the built-in Swagger UI.

Access Swagger docs at:

```text
http://127.0.0.1:3000/api-docs
```

It includes detailed schemas for:

* User registration and login
* User profiles
* Transaction objects

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Authentication:** JWT-based authentication
* **API Docs:** Swagger (OpenAPI 3.1)
* **License:** Apache 2.0

---

## 🏁 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Duard4/money-guard-backend.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the server:

   ```bash
   npm start
   ```

4. Access API at:

   ```text
   http://127.0.0.1:3000
   ```

---

## 🔗 Useful Links

* 🌐 **Frontend:** [Money Guard Frontend](https://github.com/DarkLordSith/MoneyG_Project_group-02)
* 🚀 **Live App:** [Money Guard on Vercel](https://money-g-project-group-02.vercel.app/)
* 📄 **License:** Apache 2.0

---

## ❤️ Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests to improve the project.
