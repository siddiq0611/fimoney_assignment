# Inventory Management Tool API

A full-stack Inventory Management application with a FastAPI backend and a lightweight HTML/CSS/JS frontend. It allows user registration/login, and product management (add, view, and update) using a MongoDB Atlas database. The application is containerized with Docker for easy deployment.

## Features

- User registration and login (JWT authentication)
- Add, update, and fetch products
- Secure endpoints (JWT required)
- MongoDB Atlas for data persistence
- Dockerized for easy deployment
- Health check endpoints
- Production-ready configuration

---

## Tech Stack

### Backend
- **FastAPI** – For building high-performance APIs
- **MongoDB Atlas** – Cloud-hosted NoSQL database
- **PyMongo** – MongoDB driver for Python
- **JWT Authentication** – Secured endpoints using access tokens
- **Python-Decouple** – Environment variable management
- **Pydantic** – Data validation
- **Docker** – Containerization for deployment

### Frontend
- **HTML5** – Basic UI structure
- **CSS3** – Styling
- **Vanilla JavaScript** – API interaction and dynamic behavior

---

## Project Structure

```
inventory-management/
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
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Local development setup
├── .dockerignore          # Docker ignore file
├── start.sh               # Application startup script
├── README.md              # Project documentation
├── init_db.py             # Utility to initialize MongoDB collections and indexes
└── .env                   # Environment variables (excluded from Git)
```

---

## Setup Instructions

### Option 1: Docker Deployment (Recommended)

#### 1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd inventory-management
```

#### 2. **Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
MONGODB_URL=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=inventory_db
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 3. **Build and Run with Docker**

```bash
# Build the Docker image
docker build -t inventory-management .

# Run the container (PORT environment variable configures the port)
docker run -p 8000:8000 -e PORT=8000 --env-file .env inventory-management

# Or run on a different port
docker run -p 3000:3000 -e PORT=3000 --env-file .env inventory-management
```

#### 4. **Using Docker Compose (Local Development)**

For local development with a MongoDB instance:

```bash
# Update .env to use local MongoDB
# MONGODB_URL=mongodb://admin:password123@mongo:27017/inventory_db?authSource=admin

# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

### Option 2: Local Development Setup

#### 1. **Install Dependencies**

```bash
pip install -r requirements.txt
```

#### 2. **Set Up Environment Variables**

Create a `.env` file as described above.

#### 3. **Initialize Database**

```bash
python init_db.py
```

#### 4. **Run the Server**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Accessing the Application

- **API Base URL:** `http://localhost:8000` (or your configured PORT)
- **Health Check:** `http://localhost:8000/health`
- **API Documentation:** `http://localhost:8000/docs`
- **Frontend:** Open `frontend/index.html` in your browser

---

## Authentication Flow

### Register a User

```http
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

### Login and Receive JWT Token

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=john_doe&password=secure_password
```

### Add Authorization Header to Protected Endpoints

```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

| Method | Endpoint                   | Description                   | Auth Required  |
|--------|----------------------------|-------------------------------|----------------|
| GET    | `/`                        | Root endpoint                 | ❌             |
| GET    | `/health`                  | Health check                  | ❌             |
| POST   | `/register`                | Register a new user           | ❌             |
| POST   | `/login`                   | User login                    | ❌             |
| GET    | `/products`                | Fetch all products            | ✅             |
| GET    | `/products/{id}`           | Get a specific product        | ✅             |
| POST   | `/products`                | Add a new product             | ✅             |
| PUT    | `/products/{id}/quantity`  | Update quantity of a product  | ✅             |

---

## Docker Configuration

### Environment Variables

The Docker container uses the following environment variables:

- `PORT` - Port number for the application (required for deployment)
- `MONGODB_URL` - MongoDB connection string
- `DATABASE_NAME` - MongoDB database name
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

### Health Checks

The application includes health check endpoints:
- `GET /health` - Application health status

---

## API Documentation

Interactive documentation is available at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## Testing the API

### **With Swagger UI**

1. Open `http://localhost:8000/docs` in your browser
2. Use the "Try it out" button on endpoints:
   - **POST /register** — Register a new user
   - **POST /login** — Log in and get a JWT token
   - **GET /products** — Get all products (requires JWT)
   - **POST /products** — Add a new product (requires JWT)
   - **PUT /products/{id}/quantity** — Update product quantity (requires JWT)

### **With cURL**

#### **1. Register**
```bash
curl -X POST "http://localhost:8000/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}'
```

#### **2. Login**
```bash
curl -X POST "http://localhost:8000/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=testuser&password=testpass"
```

#### **3. Authenticated Requests**
```bash
# Get products (replace TOKEN with your JWT token)
curl -X GET "http://localhost:8000/products" \
     -H "Authorization: Bearer TOKEN"
```

---

## Production Deployment

### Docker Deployment

The application is designed to work with any Docker-compatible deployment platform:

1. **Build the image:**
   ```bash
   docker build -t inventory-management .
   ```

2. **Deploy with environment variables:**
   - Set `PORT` environment variable for the listening port
   - Configure `MONGODB_URL` for your production database
   - Set a secure `SECRET_KEY`

3. **Example deployment command:**
   ```bash
   docker run -p 80:8080 -e PORT=8080 \
     -e MONGODB_URL="your-production-mongodb-url" \
     -e SECRET_KEY="your-production-secret-key" \
     inventory-management
   ```

### Security Considerations

- Use strong, unique `SECRET_KEY` in production
- Configure proper MongoDB access controls
- Use HTTPS in production (reverse proxy recommended)
- Regular security updates for dependencies

---

## Troubleshooting

### Common Issues

1. **Import Errors:**
   - Ensure `PYTHONPATH` is set correctly in Docker
   - Check that all files are in the correct directory structure

2. **Database Connection:**
   - Verify MongoDB URL is correct
   - Check network connectivity to MongoDB Atlas
   - Ensure database user has proper permissions

3. **Authentication Issues:**
   - Verify JWT token is included in Authorization header
   - Check token hasn't expired
   - Ensure SECRET_KEY matches between login and verification

### Logs

Check application logs for detailed error information:
```bash
# For Docker containers
docker logs <container-id>

# For local development
# Logs appear in terminal where uvicorn is running
```

---

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Style

```bash
# Format code
black app/
isort app/

# Lint code
flake8 app/
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Notes

- Ensure your MongoDB Atlas cluster allows connections from your deployment environment
- JWT tokens are required for all product-related endpoints
- The application runs on an insecure port (HTTP) as configured for deployment platforms
- Database indexes are automatically created on startup
- The application includes proper error handling and logging