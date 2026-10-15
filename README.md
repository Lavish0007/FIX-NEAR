# FixNear — Full-Stack MERN Civic Issue Reporting Platform

FixNear is a modern civic issue reporting platform where citizens can report everyday neighborhood problems (potholes, dark streetlights, overflowing garbage, water leakage, damaged pavements) and track their progress through a real-time lifecycle pipeline.

This codebase is structured to be **100% beginner-friendly**, clean, and easy to explain in software engineering (SDE) technical interviews.

---

## 1. Quick Start

### Default Demo Account
You can immediately log in with these seeded credentials on the `/login` page:
* **Email:** `demo@fixnear.app`
* **Password:** `FixNear@2026`

Or click the **"Try Demo Account (1-Click Sign In)"** button on the login screen.

---

## 2. Technology Stack

### Frontend
* **React 19** — Component-driven user interface
* **Vite** — High-speed development and asset bundling
* **React Router v7** — Client-side route management and route protection
* **Tailwind CSS v4** — Clean, responsive utility styling
* **Framer Motion** — Smooth entrance, status transitions, and timeline animations
* **Lucide React** — Minimalist vector iconography
* **Axios** — HTTP client for REST API communication

### Backend
* **Node.js** — JavaScript runtime on the server
* **Express.js** — Web framework for REST API routing and middleware
* **MongoDB Atlas** — Cloud-hosted NoSQL database
* **Mongoose** — Object Data Modeling (ODM) library for MongoDB
* **JSON Web Token (jsonwebtoken)** — Stateless authentication using bearer tokens
* **bcryptjs** — Industry-standard salted password hashing
* **cors** — Cross-Origin Resource Sharing enablement
* **dotenv** — Environment configuration management

---

## 3. How FixNear Backend Works (Flow Architecture)

```text
       USER
        ↓ (fills form and clicks submit)
  REACT FRONTEND
        ↓ (sends JSON with Authorization: Bearer <token>)
      AXIOS
        ↓ (HTTP POST /api/issues)
   EXPRESS API
        ↓ (protect middleware verifies JWT)
 ISSUE CONTROLLER
        ↓ (validates title, location, priority & generates reportId)
     MONGOOSE
        ↓ (formats data against Issue schema)
  MONGODB ATLAS
        ↓ (saved into 'issues' collection)
 RESPONSE RETURNED
        ↓ (JSON { success: true, issue: { ... } })
DASHBOARD UPDATES LIVE!
```

### Component Breakdown
1. **React**: Renders the interface, manages form inputs, and reacts to state changes.
2. **Axios**: Sends HTTP requests (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) from the browser to Express endpoints.
3. **Node.js**: The environment executing JavaScript outside of the browser on your computer or cloud server.
4. **Express.js**: Listens for HTTP requests on defined routes (e.g. `/api/issues`) and dispatches them to controller functions.
5. **Mongoose**: Validates data schemas, types, and defaults, then executes operations against MongoDB.
6. **MongoDB Atlas**: The cloud database storing documents for users, issues, notifications, and comments.
7. **JWT (JSON Web Token)**: Cryptographically signed token confirming the identity of the logged-in user without keeping session state in server memory.
8. **bcryptjs**: One-way hashing algorithm that transforms plain passwords into unrecoverable hashes with salt rounds before storing them.

---

## 4. API Reference Table

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register new user account | No |
| **POST** | `/api/auth/login` | Log in and receive JWT token | No |
| **GET** | `/api/auth/me` | Fetch currently authenticated user profile | Yes (Bearer JWT) |
| **GET** | `/api/issues/my` | Get all issues reported by current user | Yes (Bearer JWT) |
| **GET** | `/api/issues/stats` | Get calculated metrics (Total, Active, Resolved, High Priority) | Yes (Bearer JWT) |
| **POST** | `/api/issues` | Create new issue (generates unique `FX-...` report ID) | Yes (Bearer JWT) |
| **GET** | `/api/issues/:id` | Look up single issue by report ID or Mongo ObjectId | No / Public |
| **PUT** | `/api/issues/:id` | Update issue details (Owner only) | Yes (Bearer JWT) |
| **DELETE**| `/api/issues/:id` | Delete issue (Owner only) | Yes (Bearer JWT) |
| **PATCH**| `/api/issues/:id/status`| Update issue status (REPORTED → IN PROGRESS → RESOLVED) | Yes (Bearer JWT) |
| **GET** | `/api/notifications` | Get activity feed notifications for user | Yes (Bearer JWT) |
| **PATCH**| `/api/notifications/:id/read` | Mark individual notification as read | Yes (Bearer JWT) |
| **PATCH**| `/api/notifications/read-all` | Mark all notifications as read | Yes (Bearer JWT) |
| **GET** | `/api/comments/:issueId` | Get discussion comments for an issue | Public |
| **POST** | `/api/comments/:issueId` | Post a new comment on an issue | Yes (Bearer JWT) |
| **GET** | `/api/health` | Health check diagnostics endpoint | No |

---

## 5. MongoDB Atlas Setup Guide

Follow these steps to connect your own free MongoDB Atlas cloud cluster:

### Step 1: Create an Account
Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.

### Step 2: Create a Free Shared Cluster
* Click **Create Deployment** → Select **M0 Free (Shared)**.
* Pick a cloud provider (AWS/GCP/Azure) and a region nearest to you.
* Click **Create**.

### Step 3: Create a Database User
* In the Security Quickstart, create a database username and password (e.g., `fixnear_user` and a strong password).
* Save these credentials.

### Step 4: Network Access (IP Whitelist)
* Go to **Security → Network Access** in the left sidebar.
* Click **Add IP Address**.
* Select **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
* Confirm.

### Step 5: Get Connection String
* Go to **Database Deployments** → Click **Connect**.
* Select **Drivers** (Node.js).
* Copy the connection string format:
  ```text
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fixnear?retryWrites=true&w=majority
  ```

### Step 6: Configure Environment
Copy `.env.example` to `.env` in the project root (or create `server/.env`) and replace the placeholders:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fixnear?retryWrites=true&w=majority
JWT_SECRET=<a-unique-random-secret-at-least-32-characters>
```
Keep the real `.env` file out of version control. The server loads both supported environment-file locations and uses environment variables supplied by the host in preference to file values.

### Step 7: Run Backend
```bash
npm run dev
```
Terminal will output:
```text
FixNear server running on port 3000
MongoDB connected successfully
```
Account registration, login, and persistent issue data require a reachable MongoDB database and a configured JWT secret. Without MongoDB, the server can still start its demo preview, but registration and login return a service-unavailable response instead of pretending that an account was saved to temporary memory. Check `/api/health`; its `database` field reports whether MongoDB is connected.

---

## 6. Beginner Mentor Guide: Key Concepts Explained

### 1. What is `server.ts` / `server.js`?
It is the main entry door of your backend application. It configures the Express server, connects to the database, mounts API routes, and starts listening for incoming network requests on a designated port.

### 2. What is a Route?
A route maps a specific HTTP Method (`GET`, `POST`, `PUT`, `DELETE`) and URL path (`/api/issues`) to the code that should execute when that URL is accessed.

### 3. What is a Controller?
A controller is a function containing the actual business logic for a route. For example, `createIssue` checks whether the user provided a title, generates an ID, calls Mongoose to save it in the database, and returns a JSON response.

### 4. What is a Model?
A model represents a collection in MongoDB and defines its schema (what fields exist, their types like `String` or `Date`, and whether they are required).

### 5. What is Middleware?
A middleware is a function that runs *between* when a request arrives and when the controller executes. For example, `protect` checks if the incoming request has a valid JWT header before allowing it to reach the issue controller.

### 6. What is JWT?
A JSON Web Token is a compact string composed of header, payload, and digital signature. Once a user logs in, the backend signs a token containing the user's ID. The client stores this in localStorage and sends it with subsequent requests to prove their identity without needing to look up passwords repeatedly.

### 7. What is bcrypt?
A cryptographic library used to hash passwords. Hashing is a one-way mathematical function; a hashed password cannot be decrypted back into plain text. When logging in, `bcrypt.compare` hashes the entered password and checks if the output matches the stored hash.

### 8. What is MongoDB Atlas?
A fully managed cloud database service hosted by MongoDB that stores documents as flexible BSON/JSON records across distributed clusters.

### 9. What is Mongoose?
A Node.js library that acts as a translator between JavaScript and MongoDB, enforcing schemas, relationships, and validation rules.

### 10. How does a React form reach MongoDB?
1. The user fills form inputs bound to React state (`title`, `location`).
2. The form `onSubmit` handler calls Axios: `issueService.create(...)`.
3. Axios sends an HTTP POST request to `/api/issues` with the JSON payload.
4. Express routes this to `createIssue` in `issueController.ts`.
5. The controller calls Mongoose: `await Issue.create(...)`.
6. Mongoose serializes the object and writes it into the MongoDB collection.

### 11. Where is the password stored?
In the `users` collection of MongoDB as an encrypted hash string (e.g. `$2a$10$e8wY...`). The plain text password is never saved to disk or returned in API responses.

### 12. Where is the report stored?
In the `issues` collection of MongoDB, linked to the creator by the `userId` field.

### 13. How does the backend know which user created a report?
When the client calls `POST /api/issues`, Axios sends the header:
```text
Authorization: Bearer <token>
```
The `protect` middleware decodes this token, extracts the authenticated user's ID, and sets `req.user = { id, email, name }`. The controller then simply sets `userId = req.user.id`.
