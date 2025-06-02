# My Wallet Application

A full-stack application for managing user wallets and transactions, built with a React frontend, FastAPI backend, and PostgreSQL database, all containerized with Docker.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Running the Application](#3-running-the-application)
- [Accessing the Application](#accessing-the-application)


## Tech Stack

* **Frontend:** React (using Create React App, Axios)
* **Backend:** Python, FastAPI (with Uvicorn, SQLAlchemy, Alembic, Pydantic)
* **Database:** PostgreSQL 15
* **Containerization:** Docker, Docker Compose


## Prerequisites

Before you begin, ensure you have the following installed on your system:
* [Docker Engine](https://docs.docker.com/engine/install/)
* [Docker Compose](https://docs.docker.com/compose/install/) 

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SimonMuncan/Bankapp.git
cd https://github.com/SimonMuncan/Bankapp.git
```

### 2. Running the Application

To run:
```bash
docker-compose up --build
```
To stop:
```bash
docker-compose down
```

## Accessing the Application
Once the containers are up and running:

Frontend (My Wallet App):

URL: http://localhost:3000
Backend API:

Base URL: http://localhost:8001
FastAPI Docs (Swagger UI): http://localhost:8001/docs
FastAPI ReDoc: http://localhost:8001/redoc


