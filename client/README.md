# 🚀 H&P Solutions: Enterprise SaaS Marketplace Engine

![Version](https://img.shields.io/badge/version-1.0.0--enterprise-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)
![AI](https://img.shields.io/badge/AI-Gemini_NLP-purple.svg)
![License](https://img.shields.io/badge/license-Commercial-red.svg)

A high-performance, white-label B2B/B2C service marketplace engineered for scale. Built with a modern **MERN Stack**, this architecture features strict Role-Based Access Control (RBAC), multi-tenant data isolation, an autonomous AI support engine, and a scalable order processing pipeline.

Perfect for agencies, service businesses, and SaaS founders looking for a turnkey, production-ready solution.

## 📸 System Previews

1.  Admin Control Center : <img width="1122" height="647" alt="image" src="https://github.com/user-attachments/assets/2175f130-a0cd-4eef-bacc-49390245bd47" />

2. Checkout / Cart : <img width="1120" height="593" alt="image" src="https://github.com/user-attachments/assets/b1de194b-a76a-4805-ac38-cee6f13b94fe" />

3. Manager Pipeline : <img width="1121" height="579" alt="image" src="https://github.com/user-attachments/assets/c3632ae3-c17e-492b-b2b1-8fc629dee9f6" />

4. Feedback Hub : <img width="1123" height="643" alt="image" src="https://github.com/user-attachments/assets/68d2afc8-088e-44cf-97e6-90a0ec89e6f6" />

5. AI Chatbot : <img width="1122" height="655" alt="image" src="https://github.com/user-attachments/assets/14a3cd26-f8e8-40c5-ba38-d665b8ae45f8" />




---

## ✨ Enterprise-Grade Features

### 🔐 4-Tier Strict RBAC & Data Isolation
- **Roles:** User, Manager, Admin, and Super Admin.
- **Sandbox Firewall:** Parallel universe data routing ensures `Demo` accounts never leak or modify live production data.
- **JWT Cryptography:** Fully secured routes with isolated middleware token parsing.

### 🤖 Autonomous AI ServiceBot (Gemini NLP)
- **Live Generative AI:** Handles customer queries, order tracking, and service guidance.
- **Graceful Edge Fallback:** Advanced local RegEx-based knowledge engine takes over instantly if API limits are hit, ensuring 0% downtime in customer support.
- **Multi-lingual:** Native query understanding (English, Hindi, Gujarati).

### 🛒 High-Converting Glassmorphism Checkout
- **Premium UI:** Apple-like floating invoices, 3D interactive credit card verification UI, and smooth animations.
- **Smart Gateway Integration:** Pre-configured simulated secure payment gateways (UPI / Cards / COD) with dynamic tax, discount, and shipping calculations.

### 📊 Smart Order Pipeline (State Machine)
- **Manager Workflows:** `Pending` ➔ `Approved` ➔ `Processing` ➔ `Shipped`.
- **Auto-Fulfillment Cron:** Orders are automatically marked as `Delivered` upon reaching destination timeframes, updating live metrics instantly.

### 📈 Global Telemetry & Feedback Hub
- **Admin Control Center:** Live analytics, revenue graphs, and system tracking.
- **Feedback Hub:** Real-time customer insight dashboard allowing admins to filter, monitor, and moderate platform reviews.

---

## 💻 Technology Stack

* **Frontend:** React.js, Tailwind CSS V3, Framer Motion, Lucide Icons, Swiper.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with complex Aggregation Pipelines), Mongoose ORM
* **Security:** Bcrypt.js, JSON Web Tokens (JWT)
* **AI Engine:** Google Gemini AI API

---

## 🗓️ Release & Development Sprint
**Enterprise Stable Release Phase:** `30-05-2026 to 09-06-2026`
This intensive development window successfully culminated in the finalization of the Sandbox Data Isolation modules, the offline AI fallback engine, and the multi-tier order state machine. The current build reflects the robust stability achieved during this sprint.

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB URI

### Setup Instructions

1. **Clone the repository:**
   ```bash
   
   git clone [https://github.com/Hiren2/hp-solutions-marketplace.git](https://github.com/Hiren2/hp-solutions-marketplace.git)
   cd hp-solutions-marketplace
   Install Dependencies:

Bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
Environment Configuration:
Rename .env.example to .env in the backend folder and provide your keys:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
Run the Application:

Bash
# Run Backend (from /backend)
npm run dev

# Run Frontend (from /frontend)
npm start


💼 Commercial & Licensing
This software architecture is a proprietary asset. It is available for Commercial Licensing or Full Exclusive Buyout.

Single Deployment License: Ideal for agencies looking to deploy a white-label version for a client.

Full IP Acquisition: Complete source code transfer and intellectual property handover for SaaS founders.
📺 **Video Walkthrough:** [Watch the Full Demo Here](https://youtu.be/h-tCjuylb34)

Contact for Demos, Pricing, and Acquisition:

📧 Email: dev048338@gmail.com



Built with precision and engineered for scale.
