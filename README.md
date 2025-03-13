# 🍳SHOPITO Project

## Description

this is a lms project, that i have build while learning full stack development with my mentor. in this project i have build from scratch lots of feature like authentication, user management, course management, lecture management, lecture dashboard & admin dashboard and more...

![SHOPITO](https://res.cloudinary.com/dksmrp2im/image/upload/v1741868444/Screenshot_2025-03-13_173800_p9vdfx.png)

## Project Structure

The project follows a well-organized structure:

```
SHOPITO-Project/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   ├── corsOptions.js
│   │   ├── stripe.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── contactController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validateRequest.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   ├── Product.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   ├── upload.js
│   ├── validations/
│   │   ├── authValidation.js
│   │   ├── productValidation.js
│   ├── server.js
│   ├── .env.example.js
│   ├── package.json
│   ├── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx/
│   │   ├── index.css/
│   │   ├── main.jsx/
│   │   ├── ...
│   ├── .env.example.js
│   ├── vite.config
│   ├── vercel.json
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── ...
└──
```


## Features

💡 User Authentication: Sign up, log in, and reset password via email verification.
🙋 User Profile: Edit personal details, view order history, and manage addresses.
🛒 Product Management: Admin can add, edit, and delete products.
📦 Order Management: Admin can manage user orders, update order statuses, and process refunds.
💳 Checkout & Payment: Secure checkout with multiple payment options (Razorpay/Stripe).
🏷️ Cart & Wishlist: Users can add products to the cart and save items to the wishlist for later.
🔎 Search & Filters: Advanced search functionality with category-based filtering.
🚚 Shipping & Delivery Tracking: Users can track their orders and view estimated delivery times.
⭐ Reviews & Ratings: Customers can leave reviews and ratings on purchased products.
🏪 Admin Dashboard: Overview of sales, users, and product inventory for business insights.

## API Endpoints

# 📌 API Routes for MERN Ecommerce Platform  

This section documents all the API routes available in the **VS-Shopito** ecommerce platform.

---

## **1️⃣ Authentication Routes (`/api/auth`)**  
Handles user authentication, profile management, and contact inquiries.  

### **🔓 Public Routes:**  
- **`POST /api/auth/register`** – Register a new user (supports avatar upload).  
- **`POST /api/auth/login`** – Authenticate user and return a token.  
- **`POST /api/auth/logout`** – Log out the authenticated user.  
- **`POST /api/auth/contact`** – Submit a contact inquiry.  

### **🔒 Admin-Only Routes:**  
- **`GET /api/auth/users`** – Retrieve a list of all users.  
- **`PUT /api/auth/users/:id`** – Edit a user’s details.  
- **`DELETE /api/auth/users/:id`** – Delete a user.  
- **`GET /api/auth/users/:id`** – Fetch a specific user by ID.  

📌 **Middleware Used:** `protect`, `admin`, `authLimiter`, `upload.single("avatar")`, `validateRequest`.  

---

## **2️⃣ User Routes (`/api/users`)**  
Handles user profile management and authentication.  

### **🔒 Protected Routes:**  
- **`GET /api/users/me`** – Retrieve current authenticated user’s details.  
- **`GET /api/users/profile`** – Get the user's profile.  
- **`PUT /api/users/profile`** – Update user profile (supports avatar upload).  
- **`PUT /api/users/profile/password`** – Update user password.  

📌 **Middleware Used:** `protect`, `upload.single("avatar")`.  

---

## **3️⃣ Product Routes (`/api/products`)**  
Handles product creation, retrieval, updating, and deletion.  

### **🔓 Public Routes:**  
- **`GET /api/products`** – Retrieve all products.  
- **`GET /api/products/:id`** – Get details of a specific product.  

### **🔒 Admin-Only Routes:**  
- **`POST /api/products`** – Create a new product (supports image uploads, max 5).  
- **`PUT /api/products/:id`** – Update an existing product with new details.  
- **`DELETE /api/products/:id`** – Remove a product from the database.  

📌 **Middleware Used:** `protect`, `admin`, `validateRequest`, `upload.array("images", 5)`.  

---

## **4️⃣ Cart Routes (`/api/users/cart`)**  
Handles adding, updating, and removing items from the shopping cart.  

### **🔒 Protected Routes:**  
- **`POST /api/users/cart`** – Add a product to the cart.  
- **`GET /api/users/cart`** – Retrieve user's cart items.  
- **`DELETE /api/users/cart/clear`** – Clear the entire cart.  
- **`PUT /api/users/cart/item`** – Update the quantity of a cart item.  
- **`DELETE /api/users/cart/item/:productId`** – Remove a specific item from the cart.  

📌 **Middleware Used:** `protect`.  

---

## **5️⃣ Order Routes (`/api/users/orders`)**  
Handles order creation, retrieval, updates, and management.  

### **🔒 User Routes:**  
- **`POST /api/users/orders`** – Create a new order.  
- **`GET /api/users/orders/myorders`** – Retrieve authenticated user's order history.  
- **`GET /api/users/orders/:id`** – Get details of a specific order.  
- **`PUT /api/users/orders/:id`** – Mark an order as paid.  
- **`DELETE /api/users/orders/:id`** – Delete an order.  

### **🔒 Admin-Only Routes:**  
- **`GET /api/users/orders`** – Retrieve all orders.  
- **`PUT /api/users/orders/:id/status`** – Update order status (Processing, Shipped, Delivered).  
- **`PUT /api/users/orders/:id/edit`** – Edit order details.  

📌 **Middleware Used:** `protect`, `admin`.  

---

## **6️⃣ Payment Routes (`/api/payments`)**  
Handles payment processing for orders.  

### **🔒 Protected Routes:**  
- **`POST /api/payments/create-payment-intent`** – Create a payment intent.  
- **`POST /api/payments/confirm-payment`** – Confirm and finalize payment.  

📌 **Middleware Used:** `protect`.  

---

## **7️⃣ Category Routes (`/api/categories`)**  
Handles product category management.  

### **🔓 Public Routes:**  
- **`GET /api/categories`** – Retrieve all categories.  
- **`GET /api/categories/:id`** – Get category details.  

### **🔒 Admin-Only Routes:**  
- **`POST /api/categories`** – Create a new category.  
- **`PUT /api/categories/:id`** – Update a category.  
- **`DELETE /api/categories/:id`** – Delete a category.  

📌 **Middleware Used:** `protect`, `admin`.  

---

### **📌 Middleware Definitions:**  
- `protect` – Ensures only authenticated users can access certain routes.  
- `admin` – Restricts access to admin users only.  
- `authLimiter` – Prevents brute force login attempts.  
- `validateRequest` – Validates API request data against predefined schemas.  
- `upload.single('avatar')` – Handles avatar image uploads.  
- `upload.array('images', 5)` – Handles multiple product image uploads (max 5).  

---

## 🚀 Tech Stack  

The backend of this ecommerce platform is built using modern web technologies and frameworks to ensure high performance, security, and scalability.

### **Backend Technologies**  
- **Node.js** – JavaScript runtime for building scalable applications.  
- **Express.js** – Web framework for handling API routes and middleware.  
- **MongoDB & Mongoose** – NoSQL database with an object modeling tool for schema validation.  
- **JSON Web Tokens (JWT)** – Secure authentication and authorization.  
- **Bcrypt & BcryptJS** – Hashing library for encrypting passwords.  
- **Cloudinary** – Cloud storage for managing product images.  
- **Multer** – Middleware for handling file uploads.  
- **Nodemailer** – Email service for sending verification emails.  
- **Stripe** – Payment gateway for processing transactions.  
- **Joi & Express-Validator** – Data validation for API requests.  
- **Express-Async-Handler** – Middleware for handling async errors.  
- **Helmet & CORS** – Security middleware to protect API requests.  
- **Morgan** – HTTP request logger for debugging.  
- **Express-Rate-Limit** – Protects against brute force attacks.  
- **UUID** – Generates unique identifiers for various entities.  

This tech stack ensures a **secure, efficient, and scalable** ecommerce platform. 🚀  

## 🎨 Frontend Tech Stack  

The frontend of this ecommerce platform is built using **modern React.js technologies** to provide a fast, interactive, and user-friendly experience.

### **Frontend Technologies**  
- **React.js (18.x)** – Component-based UI library for building dynamic applications.  
- **Vite** – Lightning-fast build tool for frontend development.  
- **React Router** – Enables navigation and routing between pages.  
- **Redux & Redux Toolkit** – State management for global data handling.  
- **Redux Persist & Redux Thunk** – Persistent state management and async handling.  
- **React Hook Form** – Efficient form validation and state management.  
- **Axios** – Handles API requests to interact with the backend.  
- **Framer Motion & GSAP** – Smooth animations and transitions.  
- **React Icons & Lucide-React** – Lightweight icon libraries.  
- **Recharts** – Charting library for data visualization.  
- **React-Toastify** – Toast notifications for user feedback.  

### **UI & Styling**  
- **Tailwind CSS** – Utility-first CSS framework for responsive design.  
- **Material UI (MUI)** – Pre-styled UI components for a sleek look.  
- **Emotion & Styled Components** – CSS-in-JS for dynamic styling.  

### **Payments & Security**  
- **Stripe & Razorpay** – Secure payment gateways for transactions.  

### **Development & Linting**  
- **ESLint & Prettier** – Code linting and formatting tools.  
- **PostCSS & Autoprefixer** – Styles optimization and browser compatibility.  
- **TypeScript Support** – Type safety with `@types/react` and `@types/react-dom`.  

This frontend tech stack ensures a **high-performance, scalable, and visually appealing** ecommerce platform. 🚀  


---

## Getting Started

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/vikramsingh-786/mern-ecommerce-platform.git
   cd Ecommerce
   ```

2. Set up the backend:
   - Navigate to the `backend` folder.
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the backend server: `npm start`

3. Set up the frontend:
   - Navigate to the client folder: `cd frontend`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the client development server: `npm run dev`

4. Access the application:
   - Open your browser and visit: `http://localhost:5173`

---

_Made with ❤️ by [Vikram Singh](linkedin.com/in/vikram-singh-508b08250/)_
