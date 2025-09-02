# Nexus CRM - Full-Stack Customer Management App

A complete full-stack web application for managing customer and address information, built with the MERN stack (using SQLite instead of MongoDB). This project serves as a demonstration of core full-stack development skills, including API design, database management, and modern frontend development with React.

<img width="1902" height="973" alt="Image" src="https://github.com/user-attachments/assets/8e67f356-c7eb-4b4d-8f22-cc93b883f169" />

---

## 🚀 Live Demo

**The live application is deployed and can be viewed here:**

[**https://customer-management-app-beta.vercel.app/**](https://customer-management-app-beta.vercel.app/)  


---

## ✨ Features

This application includes a comprehensive set of features for a real-world CRM tool:

* **👤 Customer Management (CRUD):** Full Create, Read, Update, and Delete functionality for customer records.
* **🏡 Multiple Address Management:** Each customer can have one or more addresses, which can be added or deleted.
* **🔍 Powerful Search & Filter:** A dynamic search bar that filters customers in real-time by Name, City, State, or Pincode.
* **🚩 "Only One Address" Flag:** The system automatically detects and flags customers with a single registered address, both on the main list and in the detail view.
* **📄 Pagination:** The backend API supports pagination to efficiently handle large amounts of customer data.
* **💬 Confirmation Messages:** User-friendly "toast" notifications provide clear feedback for successful actions like creating, updating, and deleting records.
* **📱 Responsive Design:** The UI is fully responsive and works seamlessly on desktop, tablet, and mobile devices.
* **🧭 Navigation:** A clean, modern sidebar for easy navigation between different sections of the app, powered by React Router.

---

## 🛠️ Tech Stack

This project was built using a modern, robust tech stack:

* **Frontend:**
    * [React JS](https://reactjs.org/)
    * [React Router](https://reactrouter.com/) for page navigation
    * [Axios](https://axios-http.com/) for API calls
    * [React Icons](https://react-icons.github.io/react-icons/) for UI icons
    * Standard CSS for styling

* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/) for the server and API routing

* **Database:**
    * [SQLite](https://www.sqlite.org/) for lightweight, file-based data storage

---

## ⚙️ Setup and Local Installation

To run this project on your local machine, follow these steps:

#### **Prerequisites**
* Node.js installed on your machine
* npm or yarn package manager

#### **1. Clone the Repository**

```bash
git clone [https://github.com/vinaykumargajjela/customer-management-app.git]
cd customer-management-app
```

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Run the server
node index.js

# The backend will be running on http://localhost:5000
```

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the React development server
npm start

# The application will open in your browser at http://localhost:3000
```

---

### ⛓️ API Endpoints
The backend provides the following RESTful API endpoints:

| Method | Endpoint                       | Description                               |
|--------|--------------------------------|-------------------------------------------|
| `POST` | `/api/customers`               | Create a new customer.                    |
| `GET`  | `/api/customers`               | Get a list of all customers (with search & pagination). |
| `GET`  | `/api/customers/:id`           | Get details for a single customer.        |
| `PUT`  | `/api/customers/:id`           | Update a customer's information.          |
| `DELETE`| `/api/customers/:id`          | Delete a customer.                        |
| `POST` | `/api/customers/:id/addresses` | Add a new address for a customer.         |
| `GET`  | `/api/customers/:id/addresses` | Get all addresses for a customer.         |
| `DELETE`| `/api/addresses/:addressId`   | Delete a specific address.                |

---

### 🌐 Deployment
The application is deployed with a decoupled architecture:

* **Backend API** is deployed on **Render**.
* **Frontend UI** is deployed on **Vercel**.

The frontend is configured with environment variables to securely connect to the live backend API, with CORS policies in place on the server to ensure secure communication.



