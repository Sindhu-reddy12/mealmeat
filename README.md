# NutriSnap AI 🥗

**AI-powered Indian food nutrition tracker** — Upload a meal photo, get instant calorie & macro analysis with health recommendations.

---

## 📁 Project Structure

```
mealmeat/
├── client/          # React + Vite + Tailwind (Frontend)
├── server/          # Node.js + Express (Backend API)
├── ml-model/        # Python + Flask (ML Service)
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone / Open the project
```bash
cd mealmeat
```

### 2. Setup Environment Variables

Copy the example file for the backend:
```bash
copy server\.env.example server\.env
```

Edit `server/.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nutrisnap
JWT_SECRET=your_secret_key_here
ML_SERVICE_URL=http://localhost:8000
```

> **Note:** If MongoDB is not set up, the app will still run — some features require a valid MongoDB URI.

---

### 3. Install & Run the Backend

```bash
cd server
npm install
npm run dev
```
Server runs on → **http://localhost:5000**

---

### 4. Install & Run the Frontend

```bash
cd client
npm install
npm run dev
```
Frontend runs on → **http://localhost:5173**

---

### 5. Setup & Run the ML Service (Python)

```bash
cd ml-model
pip install -r requirements.txt
python app.py
```
ML Service runs on → **http://localhost:8000**

> **No model?** The ML service uses a smart heuristic fallback — no training needed for the demo!

---

## 🤖 Train the ML Model (Optional)

1. Download an Indian food dataset (e.g., [Kaggle Indian Food Dataset](https://www.kaggle.com/datasets/iamsouravbanerjee/indian-food-images-dataset))
2. Organize it in `ml-model/dataset/<FoodName>/*.jpg`
3. Run training:

```bash
cd ml-model
python train.py
```

The trained model is saved to `ml-model/model/food_classifier.h5` and loaded automatically.

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |

### Meals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/meals/upload` | Upload meal image |
| GET | `/api/meals/today` | Today's meals + totals |
| GET | `/api/meals/history` | All past meals |

### ML
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` (port 8000) | Predict food from image |

---

## 🧠 How It Works

1. **User uploads** a food photo via the Upload page
2. **Backend** sends the image to the **ML Flask service**
3. **ML service** runs image through MobileNetV2 classifier (or heuristic fallback)
4. Returns: **food name + confidence score**
5. Backend **looks up macros** from `nutrition_map.json`
6. **Rule-based engine** generates a health recommendation based on goal + health condition
7. Results are **saved to MongoDB** and displayed on the Result + Dashboard pages

---

## 🌿 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS v4, Axios, React Router, Lucide React |
| Backend | Node.js, Express, JWT, Multer, Mongoose |
| Database | MongoDB Atlas (+ local JSON fallback) |
| ML Service | Python, Flask, TensorFlow/Keras, MobileNetV2, Pillow |

---

## 📝 Sample .env

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nutrisnap?retryWrites=true&w=majority
JWT_SECRET=nutrisnap_super_secret_2024
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

---

## 🍛 Supported Indian Foods (32+)

Biryani, Butter Chicken, Dal Makhani, Paneer Tikka, Samosa, Chole Bhature, Dosa, Idli, Pav Bhaji, Rajma, Palak Paneer, Aloo Paratha, Naan, Tandoori Chicken, Masala Dosa, Khichdi, Upma, Poha, Gulab Jamun, Rasgulla, Jalebi, Lassi, Chai, Vada Pav, Bhel Puri, Dhokla, Kadai Paneer, Fish Curry, Mutton Curry, Pulao, Mango Lassi, Rice and Dal

---

## ✅ Features

- 🔐 JWT Authentication (Signup / Login)
- 📸 Drag & Drop image upload
- 🤖 AI food recognition (MobileNetV2 + fallback)
- 📊 Calorie + Protein + Carbs + Fat tracking
- 💡 Rule-based health recommendations
- 📈 Daily dashboard with progress bar
- 📜 Meal history with timestamps
- 🌙 Dark mode, glassmorphism UI design

---

## 📌 Notes

- The app **always works** even without ML model or MongoDB — fallback modes are built in
- For production, replace `JWT_SECRET` with a strong random string
- Images are stored locally in `server/uploads/`
