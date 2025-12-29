# Walkthrough - RideShare & Track Microservice

A high-scale, real-time ride-sharing and tracking platform built with a microservices architecture.

## 🏗️ Architecture Overview

The system is composed of five specialized microservices, each with its own dedicated database and responsibility, ensuring high availability and scalability.

### 1. Services & Data Management
- **Auth Service**: Manages JWT-based authentication and session persistence using **Redis**.
- **User Service**: Handles rider and driver profiles with a dedicated **Postgres** instance.
- **Ride Service**: Orchestrates the ride lifecycle (booking, status changes, billing).
- **Location Service**: Powered by **PostGIS**, it handles real-time geospatial tracking and "nearest driver" lookups via **gRPC**.
- **Notification Service**: Sends real-time alerts to users and drivers using **WebSockets** and **Kafka**.

## 🚀 Key Technical Features

### 📡 Real-Time Event-Driven Communication
- **Kafka**: Used for asynchronous event broadcasting. When a ride is booked, the `Ride Service` publishes an event that the `Notification Service` consumes to alert nearby drivers.
- **WebSockets**: Provides low-latency, bi-directional communication for live driver tracking on the rider's map.

### ⚡ Performance & Scalability
- **gRPC**: Implemented for low-latency, synchronous service-to-service calls, such as the `Ride Service` calling the `Location Service` to find the 10 nearest drivers.
- **Redis Caching**:
    - **Cache Aside**: Reduces database load for user profile lookups.
    - **Write-Through**: Ensures driver location updates are instantly available in-memory for fast matching.

### 📍 Geospatial Capabilities
- **PostGIS**: Extends PostgreSQL to store and query location data efficiently, allowing for complex "find drivers within X radius" queries in milliseconds.

## 🛠️ Tech Stack
- **Backend**: Node.js, TypeScript, gRPC, Kafka
- **Database**: PostgreSQL (PostGIS), Redis
- **Infra**: Docker, Turborepo
- **Communication**: WebSockets (Socket.io), REST

## 🚦 How to Run
The project is containerized for easy local development:
```bash
cd ride-shareNtrack-microservice/backend
docker-compose -f docker-compose2.yml up -d
```
