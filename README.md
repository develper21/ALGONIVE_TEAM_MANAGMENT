
# 🧠 Task Manager — MERN Stack Project

<img width="1500" height="1000" alt="image" src="https://github.com/user-attachments/assets/66169120-03c1-4127-a3fd-1bbe8f7a8829" />

_A powerful task management web app built with the MERN stack featuring authentication, dashboards, task analytics, and admin-user collaboration._

---

### 🌐 **Live Demo**
🔗 [View Deployed App on Render](https://taskmanager-frontend-b3zq.onrender.com)   
💻 [View Source Code on GitHub](https://github.com/yashtank86/mern-task-manager-jwt-auth-admin-dashboard)

> ⚠️ **Note:**  
> - Render’s free tier **automatically shuts down the app** if it hasn't been used for a while.  
>   To load the app, you may need to **refresh the page** after opening the live demo.  
> - Uploaded **images/files may be removed** due to free-tier storage limitations.  

<!--

### Dummy User Credentials

You can use these credentials to log in and test the app:

| Role       | Email              | Password   |
|------------|--------------------|------------|
| User       | kobi@google.com    | kobi@111   |

-->
---

## 📸 **Screenshots**

### 🔐 Authentication (Login / Register)
| Login Page |
|:-------------:|
|<img width="1600" height="763" alt="image" src="https://github.com/user-attachments/assets/d555e06e-871e-4b2c-97b2-91bd24532e82" />|
|**Register Page**|
|<img width="1600" height="763" alt="image" src="https://github.com/user-attachments/assets/ea5049f1-5785-4fb7-bbf2-583c78f5d579" />|



### 🧑‍💼 Admin Dashboard
<img width="1500" height="1000" alt="admin_dashboard" src="https://github.com/user-attachments/assets/1727c1f5-517d-4dad-9556-5b4847dd9484" />


### 👤 User Dashboard
<img width="1500" height="1000" alt="user_dashboard" src="https://github.com/user-attachments/assets/bc499c4d-ff56-44d4-b840-94665e520ae4" />


### 📋 Task Creation (Admin)
<img width="1500" height="852" alt="Screenshot 2025-10-09 024115" src="https://github.com/user-attachments/assets/6a0cb1fd-c69a-48b7-ab7b-380c16c62fa0" />


### 📊 Reports & Analytics
|User Details|
|:-------------:|
|<img width="1500" height="852" alt="image" src="https://github.com/user-attachments/assets/312310ec-3360-4211-9c92-3681c0ca83c0" />|
|**Task Details**|
|<img width="1500" height="852" alt="image" src="https://github.com/user-attachments/assets/d73c154f-f0dd-45c5-8415-918147c402f3" />|



---

## 🚀 **Features**

### 🔑 **Authentication & Authorization**
- JWT-based secure authentication.
- Role-based access control (Admin / User).
- Separate dashboards for Admin and Users.

---

### 📊 **Dashboard Analytics**
#### 🧑 User Dashboard:
- Displays only User related task statistics using **Pie Chart** (Pending, In Progress, Completed).
- **Bar Chart** showing Task Priority distribution (Low, Medium, High).
- Recently added tasks section.
- Task counters at the top:  
  `Total Tasks | Pending | In Progress | Completed`

#### 🧑‍💼 Admin Dashboard:
- Overview of all system tasks and users.
- Same analytics charts for quick insights of entire system.
- Recently created tasks summary.
- Team performance overview.

---

### 📝 **Task Management (Admin)**
- Create tasks with:
  - `Title`, `Description`, `Priority (Low, Medium, High)`, and `Due Date`.
  - Assign multiple members (users).
  - Add To-do checklist (subtasks).
  - Add attachments (URL format).
- Tasks are visible to assigned members only.
- Real-time task status and progress updates based on checklist completion.

---

### 📦 **Reports & Exports (Admin)**
- Download **Task Reports** in Excel:
  - Includes: Task ID, Title, Description, Priority, Status, Assigned Members.
- Download **User Reports** in Excel:
  - Includes: Username, Email, Total Assigned Tasks, Pending, In Progress, and Completed counts.

---

### 👥 **User Features**
- View only assigned tasks.
- Update subtasks (To-do checklist).
- Watch automatic task progress and status updates.
- Filter tasks by:
  - `All | Pending | In Progress | Completed`
- View task details including:
  - Priority, Progress %, Due Date, Attachments, and Assigned Members.

---

### 💻 **Responsive Design**
- Fully responsive for all devices (Desktop, Tablet, Mobile).
- Smooth UI/UX with modern animations and charts.

---

## 🧰 **Tech Stack**

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, React Router, Axios, Chart.js, Tailwind CSS, Toaster |
| **Backend** | Node.js, Express.js, Cors, Multer, Excel.js|
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Deployment** | Render (Backend + Frontend), GitHub |
| **Reports** | XLSX (Excel Export) |

---

## ⚙️ **Installation & Setup**

### 🧾 Prerequisites
Make sure you have installed:
- Node.js (v16+)
- MongoDB
- npm or yarn

---

### 🪜 Steps

```bash
# 1️⃣ Clone the Repository
git clone https://github.com/yashtank86/mern-task-manager-jwt-auth-admin-dashboard.git

# 2️⃣ Navigate into Project
cd mern-task-manager-jwt-auth-admin-dashboard

# 3️⃣ Install Dependencies
cd backend && npm install
cd frontend && npm install

# 4️⃣ Add Environment Variables
Create `.env` file in `backend` folder and add:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
ADMIN_INVITE_TOKEN= 7-digit-Code-choose-any 

# 5️⃣ Run Backend
cd backend
npm start or npm run dev

# 6️⃣ Run Frontend
cd frontend
npm start or npm run dev
```

Then open frontend 👉 `http://localhost:5173` 
- The server runs on a PORT that may vary depending on your environment.

---

## 📦 **Folder Structure**

```
mern-task-manager-jwt-auth-admin-dashboard/
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── assets/        # Static files like images, icons, fonts
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Page Components
│   │   ├── context/       # Context API
│   │   ├── hooks/         # custom hooks
│   │   ├── utils/         # Helper functions
│   │   ├── routes/        # Route configuration
│   │   └── App.jsx
│   └── package.json
│
├── backend/               # Node + Express Backend
│   ├── config/            # Database & JWT config
│   ├── controllers/       # Business Logic
│   ├── middleware/        # Auth Middleware
│   ├── models/            # Mongoose Models
│   ├── routes/            # API Routes
│   ├── uploads/           # User Profile Pic Storage
│   └── server.js
│
└── README.md
```

---

## 📈 **Future Enhancements**
- Task comments section 💬  
- File upload for attachments 📎  
- Email notifications for task updates 📧  
- Dark/Light mode toggle 🌗  

---

## 🧑‍💻 **Author**
**Yash Tank**  
💼 Software Developer  
🌍 [LinkedIn](https://linkedin.com/in/yashtank86)  
📧 [Email Me](mailto:work.tankyash@gmail.com)

---

## ⭐ **Support**
If you like this project, don’t forget to ⭐ **star** the repository and share it!

<!--
---

## 🖼️ **Sample Preview**

### Sample Preview

Check out the dashboards in the [Screenshots above](#screenshots) or view them live in the demo.

-->
