# 🏥 Appointment Management System (Microservices Architecture)

![Architecture Diagram](./microservice-structure.png)

🚀 A **scalable, event-driven hospital management system** built using **Node.js, Express, TypeScript,redis , rabbitmq,  gRPC/tRPC, Prisma, and SQL**. It enables efficient **user management, appointment scheduling, and billing processing**.

---

## 📜 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL + Prisma ORM  
- **Microservices Communication:** gRPC / tRPC  
- **Messaging Queue:** RabbitMQ  
- **Caching:** Redis  
- **Containerization & Deployment:** Docker, Docker Compose  
- **Others:** Concurrently, Nodemon, TS-Node  

---

## 📊 Architecture Overview

### **System Workflow**
The system follows a **microservices architecture** with **gRPC, RabbitMQ, and Redis** for efficient communication.  

🖼️ **Architecture Diagram:**  
 
📍 **[Click here for full-size image](./microservice-structure.png)**  

### **Explanation of the Components**
1. **Database Layer**
   - Three separate databases: **UserDB, AppointmentDB, BillingDB**  
   - Prisma ORM interacts with databases.

2. **Microservices**
   - **User Service (Port: 50051)** → Handles user authentication & management.  
   - **Appointment Service (Port: 50052)** → Manages doctor appointments.  
   - **Billing Service** → Processes and updates bills.  
   - **API Gateway** → Acts as a single entry point for clients.

3. **Redis (Caching Layer)**
   - Stores frequently accessed data for better performance.  

4. **RabbitMQ (Message Broker)**
   - Ensures asynchronous communication between services.

5. **gRPC (Inter-service Communication)**
   - Used for efficient microservices interaction.

---

## ⚙️ Prisma Setup

### **1️⃣ Install Dependencies & Initialize Prisma**
```sh
npm install
npm install -g prisma
```



### **2️⃣ Pull Database Schema**
```sh
npm run dbpull:all
```

### **3️⃣ Run Database Migrations**
```sh
npm run migrate:all
```

### **4️⃣ Generate Prisma Client**
```sh
npm run generate:all
```

---

## 🛠️ Microservices Setup

### **1️⃣ Individual Service Setup**
Run the following commands **inside each service folder** (`user-service`, `appointment-service`, `billing-service`, `gateway`):

```sh
cd user-service
npm install
npm run dbpull
npm run migrate
npm run generate
npm run build
npm start
```
*(Repeat for other services: `appointment-service`, `billing-service`.)*

### **2️⃣ Top-Level Setup (Automated)**
Instead of setting up each service manually, run:

```sh
npm run setup:all
```

This will:
- Install dependencies for all services
- Run Prisma schema pull
- Run database migrations
- Generate Prisma clients
- Build all services

---

## 🗄️ Redis & RabbitMQ Setup

### **1️⃣ Start Redis**
```sh
docker run --name redis -p 6379:6379 -d redis
```

### **2️⃣ Start RabbitMQ**
```sh
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```
*(Access RabbitMQ UI at [http://localhost:15672](http://localhost:15672) with default credentials `guest/guest`.)*

### **3️⃣ Connect Services to Redis & RabbitMQ**
Update **`.env` files** in each service:

```env
REDIS_HOST=localhost
REDIS_PORT=6379

RABBITMQ_URL=amqp://localhost
```

---

## 🐳 Docker Setup

### **1️⃣ Build Docker Images**
```sh
docker-compose build
```

### **2️⃣ Run Containers**
```sh
docker-compose up -d
```

### **3️⃣ Stop Containers**
```sh
docker-compose down
```

---

## 🚀 Running the Application

Once everything is set up, start all services at once:

```sh
npm start
```

Or run each service separately:

```sh
cd user-service && npm start
```

---

## 📌 Environment Variables

Each service requires an `.env` file. Here’s an example `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
PORT=5001

REDIS_HOST=localhost
REDIS_PORT=6379

RABBITMQ_URL=amqp://localhost
```

Make sure to update credentials accordingly.

---

## 🌐 Setting Up Frontend

### **1️⃣ Local Setup**
```sh
cd frontend
npm install
npm run dev
```

### **2️⃣ Using Docker**
#### **➡️ Build the Docker Image**
```sh
docker build -t hms-frontend .
```

#### **➡️ Run the Container**
```sh
docker run -d -p 5173:80 --name hms-fe hms-frontend
```
- `-d` : Run in detached mode
- `-p 5173:80` : Map container port `80` to host `5173`
- `--name hms-fe` : Set container name

Access the frontend at: [http://localhost:5173](http://localhost:5173)


#### **🔹Explanation: Serving frontend with NGINX in docker**

```dockerfile
FROM nginx:latest AS serve

# Copy built files to NGINX public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
```

**Explanation:**
- Uses the **NGINX image** to serve the built application.
- Copies the built files from the previous **build stage** (`/app/dist`) into the NGINX public folder (`/usr/share/nginx/html`).
- Exposes **port 80** for HTTP access.
- Runs **NGINX in the foreground** (`daemon off`) to keep the container running.

This approach ensures a **lightweight production image** with only the necessary files to run the frontend efficiently.



---



---
## 📖 API Documentation


---

## 📩 Contributors

👨‍💻 **Developed by:**  
- **Ganesh Sahu**  

🎯 **Feel free to contribute, report issues, or suggest improvements!** 🚀

