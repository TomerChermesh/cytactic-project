# Centriq (Former Cytactic-project)

An internal platform for managing incoming calls, tasks, and tags with a modern React frontend and FastAPI backend.

Full Design & Documentation here: [👉🏼 Centric Design](https://docs.google.com/document/d/10aEbfFCCFnQFBrMRz-78qghZ2FdHUBQyNTvwgJiF09I/edit?usp=sharing)

Currently Deployed and available at: [Centric](https://centriq.tomerchermesh.com/)

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cytactic-project
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### Configure Database

Create a `.env` file in the `backend/` directory and connect to your PostgreSQL database:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/database_name
```

**Note:** Replace `username`, `password`, and `database_name` with your actual PostgreSQL credentials and database name.

#### Initialize Database

The database tables will be automatically created when you start the backend server for the first time.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Configure API URL (Optional)

Create a `.env` file in the `frontend/` directory if you need to change the API URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## ▶️ Running the Application

### Start the Backend Server

```bash
cd backend

# Activate virtual environment (if not already activated)
# On Windows
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Run the FastAPI server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

API documentation (Swagger UI) will be available at: [API Docs](http://localhost:8000/docs)

### Start the Frontend Development Server

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend application will be available at: `http://localhost:5173`


## 📝 Notes

- The backend automatically creates database tables on first startup
- CORS is configured to allow requests from `http://localhost:5173`
- Rate limiting is enabled (100 requests per 60 seconds)
- Logs are stored in `backend/logs/` directory
