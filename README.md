# CSTECH Task

This project is a full-stack assignment with a React + Vite frontend and a Node.js + Express + MongoDB backend.

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or cloud instance)

## Project Structure


---

## 1. Backend Setup

1. **Install dependencies:**

    ```sh
    cd backend
    npm install
    ```

2. **Configure environment variables:**

    Create a `.env` file in the `backend/` directory with the following variables:

    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_jwt_secret
    ACCESS_TOKEN_EXPIRY=1d
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    FRONTEND_URL=http://localhost:5173
    ```

3. **Start the backend server:**

    ```sh
    npm run dev
    ```

    The backend will run on [http://localhost:3000](http://localhost:3000) by default.

---

## 2. Frontend Setup

1. **Install dependencies:**

    ```sh
    cd frontend
    npm install
    ```

2. **Configure environment variables:**

    Edit the [.env](http://_vscodecontentref_/0) file in the [frontend](http://_vscodecontentref_/1) directory if needed:

    ```
    VITE_BACKEND_URL="http://localhost:3000/api/v1"
    ```

3. **Start the frontend dev server:**

    ```sh
    npm run dev
    ```

    The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## 3. Usage

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Login as admin (admin must be created directly in the database if not present).
- Admin can add agents, upload leads (CSV/XLSX), and view assigned leads.

---
ed files are stored in memory and processed directly.

---
