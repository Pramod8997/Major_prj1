# Gourmet - Premium Food Delivery Platform 

Gourmet is a modern, full-stack food delivery application inspired by industry leaders like Swiggy and Zomato. Built with a focus on premium aesthetics and real-time functionality, it offers a seamless experience from browsing restaurants to live tracking your food delivery.

## Key Features

### For Users
* **Advanced Search**: Instantly find your favorite dishes or restaurants with real-time fuzzy search.
* **Virtual Payment Gateway**: A smooth checkout experience featuring a simulated payment processing delay.
* **Live Order Tracking**: Watch your order progress through a beautiful `framer-motion` timeline and an interactive Google Map routing system.
* **Active Order Menu**: A persistent sidebar and navbar pulse indicator keeps you updated on your current delivery status without leaving the page.
* **Real-time Notifications**: Beautiful toast notifications (`react-hot-toast`) alert you the moment your food is "Cooking" or "Out for Delivery".

### For Administrators
* **Admin Dashboard**: A comprehensive control panel to manage the platform.
* **Live Order Management**: View all incoming orders platform-wide and dynamically update their statuses.
* **Restaurant Management**: Add new restaurants, manage cuisine types, delivery times, and delete outdated listings.

##  Technology Stack

**Frontend**
* [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/) (Premium UI design system)
* [Framer Motion](https://www.framer.com/motion/) (Smooth animations & transitions)
* [React Router DOM](https://reactrouter.com/) (Routing)
* [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api) (Interactive map routing)

**Backend**
* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
* [JSON Web Tokens (JWT)](https://jwt.io/) (Authentication)
* `mongodb-memory-server` (Automatic fallback for local development without MongoDB installed)

---

##  Project Structure

```text
Major_prj1/
├── backend/
│   ├── middleware/      # JWT and Auth middleware logic
│   ├── models/          # Mongoose DB schemas (User, Restaurant, Order, Review)
│   ├── routes/          # Express API endpoints
│   ├── seed.js          # Database populator script
│   └── server.js        # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (SearchBar, Sidebar, etc.)
│   │   ├── context/     # Global state (AuthContext, CartContext)
│   │   ├── pages/       # Route-level components (Home, Checkout, Tracking)
│   │   ├── App.jsx      # Main application router and layout
│   │   └── index.css    # Global Tailwind styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

##  Screenshots

*(Note: Create a `docs/screenshots` folder in the root directory and add your screenshots with the corresponding names below to display them!)*

### 1. Dashboard Layout & Home Page

*A sleek dashboard layout featuring a left sidebar for navigation and a responsive grid of restaurant cards.*

### 2. Live Order Tracking (Google Maps)

*Real-time order progress timeline alongside an interactive Google Maps iframe.*

### 3. Virtual Checkout & Payment

*Simulated local payment gateway for a seamless checkout experience.*

### 4. Admin Order Management

*Tabbed admin interface for managing live orders and platform restaurants.*

---

##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (Optional: the app will gracefully fallback to an in-memory database if MongoDB is not installed locally!)

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/Major_prj1.git
cd Major_prj1
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server:
```bash
cd backend
npm install
node server.js
```
> **Note:** Upon the first run, the backend will automatically seed the database with 25 restaurants and over 100 dishes with unique images! The server runs on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
> The frontend will be available at `http://localhost:5173`.

### 4. Environment Variables (Optional)
To enable the interactive Google Maps routing (instead of the fallback iframe), create a `.env` file in the `frontend` directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

##  Default Test Accounts
If using the persistent database, you can log in with:
* **Admin**: Register a new user and enter `ADMIN123` in the optional "Admin Code" field to gain dashboard access.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YourUsername/Major_prj1/issues).
