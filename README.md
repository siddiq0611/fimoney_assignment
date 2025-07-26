# Inventory Management Tool API

A full-stack Inventory Management application with a FastAPI backend and a lightweight HTML/CSS/JS frontend. It allows user registration/login, and product management (add, view, and update) using a MongoDB Atlas database.

## Features

- User registration and login (JWT authentication)
- Add, update, and fetch products
- Secure endpoints (JWT required)
- MongoDB Atlas for data persistence

---

## Tech Stack

### Backend
- **FastAPI** – For building high-performance APIs
- **MongoDB Atlas** – Cloud-hosted NoSQL database
- **PyMongo** – MongoDB driver for Python
- **JWT Authentication** – Secured endpoints using access tokens
- **Python-Decouple** – Environment variable management
- **Pydantic** – Data validation

### Frontend
- **HTML5** – Basic UI structure
- **CSS3** – Styling
- **Vanilla JavaScript** – API interaction and dynamic behavior

---

## Project Structure

```
f1money_assignment/
├── frontend/
│   ├── index.html         # Main frontend UI
│   ├── style.css          # Styles for frontend
│   └── script.js          # Client-side API interaction logic
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI entry point
│   ├── models.py          # Pydantic models for data validation
│   └── database.py        # MongoDB connection and collections
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
├── init_db.py             # Utility to initialize MongoDB collections and indexes
└── .env                   # Environment variables (excluded from Git)
```

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd f1money_assignment
```

### 2. **Install Dependencies**

```bash
pip install -r requirements.txt
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory with your MongoDB Atlas URI and JWT secret:

```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET_KEY=your_jwt_secret
```

### 4. **Run the Server**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```
- The API will be available at: [http://localhost:8080](http://localhost:8080)

### 5. **Frontend**

Go to the `frontend/` folder and open `index.html` in your browser to access the interface.

Make sure the FastAPI server is running at `http://localhost:8080`.

---

## Authentication Flow

### Register a User

```http
POST /register
Content-Type: application/json

{
  "username": "puja",
  "password": "mypassword"
}
```
### Login and Receive JWT Token

```http
POST /login
Form Data:
username=puja
password=mypassword
```

### Add Authorization Header to Protected Endpoints

```makefile
Authorization: Bearer <your_jwt_token>
```

---

## Product Management Endpoints

| Method | Endpoint                   | Description                   | Auth Required  |
|--------|----------------------------|-------------------------------|----------------|
| GET    | `/products`                | Fetch all products            | ✅             |
| POST   | `/products`                | Add a new product             | ✅             |
| PUT    | `/products/{id}/quantity`  | Update quantity of a product  | ✅             |


---

## API Documentation

Interactive docs are available at:  
**Swagger UI:** [http://localhost:8080/docs](http://localhost:8080/docs)

---

## Testing the API

### **With Swagger UI**

1. Open [http://localhost:8080/docs](http://localhost:8080/docs) in your browser.
2. Use the "Try it out" button on endpoints:
   - **POST /register** — Register a new user.
   - **POST /login** — Log in and get a JWT token.
   - **GET /products** — Get all products (requires JWT).
   - **POST /products** — Add a new product (requires JWT).
   - **PUT /products/{id}/quantity** — Update product quantity (requires JWT).

### **With Postman**

#### **1. Register**

- **POST** `http://localhost:8080/register`
- **Body:** raw, JSON
  ```json
  {
    "username": "puja",
    "password": "mypassword"
  }
  ```

#### **2. Login**

- **POST** `http://localhost:8080/login`
- **Body:** raw, JSON
  ```json
  {
    "username": "abc123",
    "password": "mypassword"
  }
  ```
- **Copy the `access_token` from the response.**

#### **3. Authenticated Requests**

- Add header:  
  `Authorization: Bearer <access_token>`
- Example: **GET** `http://localhost:8080/products`

---

## Notes

- Ensure your MongoDB Atlas cluster is accessible from your machine.
- JWT tokens are required for protected endpoints (`/products`, etc.).
- If you encounter errors, check the server terminal for logs.

---
