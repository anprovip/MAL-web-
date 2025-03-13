# Backend Setup and Running Instructions

## Prerequisites

- Python 3.8+
- Docker
- Docker Compose


1. **Run Docker Compose to start the PostgreSQL and pgAdmin services:**
   ```sh
   docker compose up -d
   ```

2. **Run the FastAPI application:**
   ```sh
   uvicorn app.main:app --reload
   ```

   The backend should now be running at `http://127.0.0.1:8000`.

## Additional Information

- Access pgAdmin at `http://127.0.0.1:5050` with the credentials:
  - Email: `admin@example.com`
  - Password: `admin`
- The PostgreSQL database will be available at `localhost:5433`.

## Endpoints

- The root endpoint: `GET /`
- Authentication endpoint: `POST /login`
- User-related endpoints: `/users`
- Post-related endpoints: `/posts`
