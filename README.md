# 🏨 Smart Hostel Complaint Management System

A full-stack MERN application designed to streamline hostel complaint registration, tracking, and resolution. The system provides role-based access for Students, Staff, Wardens, and Administrators, ensuring efficient complaint management and transparent communication.

## 🚀 Features

### 👨‍🎓 Student Portal

* Student Registration & Login
* Submit Hostel Complaints
* View Complaint Status
* Track Complaint Progress
* Secure Authentication

### 👨‍🔧 Staff Portal

* View Assigned Complaints
* Update Complaint Status
* Manage Complaint Resolution Workflow

### 👨‍💼 Warden Portal

* Monitor Hostel Complaints
* Assign Complaints to Staff
* Track Resolution Progress
* Manage Hostel Operations

### 🛡️ Admin Portal

* Manage Users
* View All Complaints
* Monitor System Activity
* Role-Based Access Control

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Vite
* React Context API
* CSS

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication


### Database

* MongoDB
* Mongoose ODM

### Security

* JWT (JSON Web Tokens)
* Password Hashing with bcryptjs
* Protected Routes
* Role-Based Authorization

---

## 📂 Project Structure

```text
Smart-Hostel-Complaint-Management-System/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Akshat-1618/Smart-Hostel-Complaint-Management-System.git
cd Smart-Hostel-Complaint-Management-System
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shcms
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

## 🔐 User Roles

| Role    | Permissions                          |
| ------- | ------------------------------------ |
| Student | Register complaints and track status |
| Staff   | Handle and update complaints         |
| Warden  | Assign and monitor complaints        |
| Admin   | Full system management               |

---

## 📌 Key Functionalities

* Complaint Registration
* Complaint Tracking
* Role-Based Dashboard
* JWT Authentication
* Secure Password Storage
* MongoDB Database Integration
* RESTful API Architecture
* Responsive User Interface

---

## 🎯 Future Enhancements

* Email Notifications
* Complaint Priority System
* Analytics Dashboard
* Mobile Application
* Real-Time Updates using Socket.IO
* Hostel Maintenance Reports
